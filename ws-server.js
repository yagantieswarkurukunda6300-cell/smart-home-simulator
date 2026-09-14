import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { WebSocketServer } from 'ws'

import { INITIAL_STATES, ROOM_ORDER, ROOMS } from './src/house.js'

const DEFAULT_PATH = '/ws'

function createEmptyState() {
  return JSON.parse(JSON.stringify(INITIAL_STATES))
}

function sanitizeState(input) {
  const out = createEmptyState()

  if (!input || typeof input !== 'object') return out

  for (const rid of ROOM_ORDER) {
    const src = input[rid]

    if (!src || typeof src !== 'object') continue

    for (const app of ROOMS[rid].appliances) {
      if (typeof src[app.id] === 'boolean') {
        out[rid][app.id] = src[app.id]
      }
    }
  }

  return out
}

function createLiveServer({
  server,
  path = DEFAULT_PATH,
  log = console.log,
} = {}) {
  let state = createEmptyState()
  let phoneDirty = false

  const clients = new Set()
  let seq = 0

  const wss = new WebSocketServer({
    noServer: true,
  })

  const handleUpgrade = (request, socket, head) => {
    const url = new URL(request.url, 'http://localhost')

    if (url.pathname !== path) {
      return
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  }

  server.on('upgrade', handleUpgrade)

  function send(ws, obj) {
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(obj))
    }
  }

  function phoneCount() {
    let count = 0

    for (const client of clients) {
      if (client.role === 'phone') {
        count += 1
      }
    }

    return count
  }

  function broadcast(obj, exceptWs = null) {
    const payload = JSON.stringify(obj)

    for (const client of clients) {
      if (client.ws === exceptWs) continue

      if (client.ws.readyState === 1) {
        client.ws.send(payload)
      }
    }
  }

  function applySync(incoming, role) {
    const next = sanitizeState(incoming)
    let changed = false

    for (const rid of ROOM_ORDER) {
      for (const app of ROOMS[rid].appliances) {
        if (state[rid][app.id] !== next[rid][app.id]) {
          state[rid][app.id] = next[rid][app.id]
          changed = true
        }
      }
    }

    if (role === 'phone') {
      phoneDirty = true
    }

    return changed
  }

  wss.on('connection', (ws) => {
    const client = {
      ws,
      id: `c${++seq}`,
      role: 'controller',
    }

    clients.add(client)

    send(ws, {
      type: 'welcome',
      clientId: client.id,
      state,
      phoneDirty,
      phones: phoneCount(),
    })

    ws.on('message', (raw) => {
      let msg

      try {
        msg = JSON.parse(String(raw))
      } catch {
        return
      }

      if (!msg || typeof msg !== 'object') {
        return
      }

      if (msg.type === 'hello') {
        if (msg.role === 'phone') {
          client.role = 'phone'
          phoneDirty = true
        }

        broadcast(
          {
            type: 'peers',
            phones: phoneCount(),
          },
          client.ws,
        )

        send(ws, {
          type: 'peers',
          phones: phoneCount(),
        })

        return
      }

      if (msg.type === 'sync') {
        if (applySync(msg.state, client.role)) {
          broadcast(
            {
              type: 'state',
              state,
            },
            client.ws,
          )
        }

        return
      }

      if (msg.type === 'ping') {
        send(ws, {
          type: 'pong',
        })
      }
    })

    ws.on('close', () => {
      clients.delete(client)

      broadcast({
        type: 'peers',
        phones: phoneCount(),
      })
    })

    ws.on('error', () => {
      clients.delete(client)

      broadcast({
        type: 'peers',
        phones: phoneCount(),
      })
    })
  })

  log(`Smart Home live bridge listening on path ${path}`)

  return {
    wss,

    close() {
      for (const client of clients) {
        try {
          client.ws.terminate()
        } catch {
          // already closed
        }
      }

      clients.clear()

      server.off('upgrade', handleUpgrade)

      wss.close()
    },
  }
}

/*
 * Serve the Vite production build.
 */
async function serveStatic(request, response) {
  const distDir = join(
    fileURLToPath(new URL('.', import.meta.url)),
    'dist',
  )

  let pathname

  try {
    pathname = decodeURIComponent(
      new URL(request.url, 'http://localhost').pathname,
    )
  } catch {
    response.writeHead(400)
    response.end('Bad Request')
    return
  }

  if (pathname === '/') {
    pathname = '/index.html'
  }

  /*
   * Prevent directory traversal.
   */
  const safePath = pathname.replace(/^\/+/, '')

  let filePath = join(distDir, safePath)

  if (!filePath.startsWith(distDir)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  /*
   * SPA fallback:
   * If the requested file doesn't exist, serve index.html.
   */
  if (!existsSync(filePath)) {
    filePath = join(distDir, 'index.html')
  }

  try {
    const data = await readFile(filePath)

    const extension = extname(filePath).toLowerCase()

    const contentTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.mjs': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
    }

    response.writeHead(200, {
      'content-type':
        contentTypes[extension] || 'application/octet-stream',
    })

    response.end(data)
  } catch (error) {
    console.error('Static file error:', error)

    response.writeHead(500, {
      'content-type': 'text/plain; charset=utf-8',
    })

    response.end('Internal Server Error')
  }
}

/*
 * Production server
 */
if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) ===
    fileURLToPath(`file://${process.argv[1].replace(/\\/g, '/')}`)
) {
  const server = createServer(async (request, response) => {
    await serveStatic(request, response)
  })

  const live = createLiveServer({
    server,
    path: DEFAULT_PATH,
  })

  const port = Number(process.env.PORT) || 5173

  server.listen(port, '0.0.0.0', () => {
    console.log(
      `Smart Home server listening on 0.0.0.0:${port}`,
    )

    console.log(
      `WebSocket bridge available at /ws`,
    )
  })

  const shutdown = () => {
    live.close()

    server.close(() => {
      process.exit(0)
    })
  }

  process.once('SIGTERM', shutdown)
  process.once('SIGINT', shutdown)
}