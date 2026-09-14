import { createServer } from 'node:http'
import { WebSocketServer } from 'ws'

import { INITIAL_STATES, ROOM_ORDER, ROOMS } from './src/house.js'

/**
 * Smart Home live bridge.
 *
 * WebSocket messages:
 *
 * Client -> Server:
 *   { type: 'hello', role: 'controller' | 'phone' }
 *   { type: 'sync', state: { <roomId>: { <appId>: boolean } } }
 *   { type: 'ping' }
 *
 * Server -> Client:
 *   { type: 'welcome', clientId, state, phoneDirty, phones }
 *   { type: 'state', state }
 *   { type: 'peers', phones }
 *   { type: 'pong' }
 */

const DEFAULT_PATH = '/ws'

function createEmptyState() {
  return JSON.parse(JSON.stringify(INITIAL_STATES))
}

function sanitizeState(input) {
  const out = createEmptyState()

  if (!input || typeof input !== 'object') {
    return out
  }

  for (const rid of ROOM_ORDER) {
    const src = input[rid]

    if (!src || typeof src !== 'object') {
      continue
    }

    for (const app of ROOMS[rid].appliances) {
      if (typeof src[app.id] === 'boolean') {
        out[rid][app.id] = src[app.id]
      }
    }
  }

  return out
}

/**
 * Attach the Smart Home WebSocket server
 * to an existing HTTP server.
 *
 * @param {object} options
 * @param {import('node:http').Server} options.server
 * @param {string} [options.path]
 * @param {(msg: string) => void} [options.log]
 */
export function createLiveServer({
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

  // Handle WebSocket upgrade requests.
  const handleUpgrade = (request, socket, head) => {
    try {
      const url = new URL(
        request.url || '/',
        'http://localhost',
      )

      if (url.pathname !== path) {
        return
      }

      wss.handleUpgrade(
        request,
        socket,
        head,
        (ws) => {
          wss.emit('connection', ws, request)
        },
      )
    } catch (error) {
      try {
        socket.destroy()
      } catch {
        // Socket already closed.
      }
    }
  }

  server.on('upgrade', handleUpgrade)

  function send(ws, obj) {
    if (!ws || ws.readyState !== 1) {
      return
    }

    ws.send(JSON.stringify(obj))
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
      if (client.ws === exceptWs) {
        continue
      }

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

  // New WebSocket connection.
  wss.on('connection', (ws) => {
    const client = {
      ws,
      id: `c${++seq}`,
      role: 'controller',
    }

    clients.add(client)

    // Send current state immediately.
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

      // Identify the device.
      if (msg.type === 'hello') {
        if (msg.role === 'phone') {
          client.role = 'phone'
          phoneDirty = true
        } else {
          client.role = 'controller'
        }

        const peerMessage = {
          type: 'peers',
          phones: phoneCount(),
        }

        broadcast(peerMessage, client.ws)
        send(ws, peerMessage)

        return
      }

      // Sync appliance state.
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

      // Ping / pong.
      if (msg.type === 'ping') {
        send(ws, {
          type: 'pong',
        })

        return
      }
    })

    // Client disconnected.
    ws.on('close', () => {
      clients.delete(client)

      broadcast({
        type: 'peers',
        phones: phoneCount(),
      })
    })

    // Client error.
    ws.on('error', () => {
      clients.delete(client)

      broadcast({
        type: 'peers',
        phones: phoneCount(),
      })
    })
  })

  log(
    `Smart Home live bridge listening on path ${path}`,
  )

  return {
    wss,

    close() {
      for (const client of clients) {
        try {
          client.ws.terminate()
        } catch {
          // Already closed.
        }
      }

      clients.clear()

      server.off('upgrade', handleUpgrade)

      wss.close()
    },
  }
}

// ---------------------------------------------------------
// Standalone server
// ---------------------------------------------------------

const isMainModule =
  process.argv[1] &&
  new URL(import.meta.url).pathname ===
    new URL(
      `file://${process.argv[1].replace(/\\/g, '/')}`,
    ).pathname

if (isMainModule) {
  const server = createServer((_request, response) => {
    response.writeHead(200, {
      'content-type': 'text/plain; charset=utf-8',
    })

    response.end('Smart Home live bridge\n')
  })

  createLiveServer({
    server,
    path: DEFAULT_PATH,
  })

  const port = Number(process.env.PORT) || 5173

  server.listen(port, '0.0.0.0', () => {
    console.log(
      `Smart Home live bridge listening on 0.0.0.0:${port}`,
    )
  })

  const shutdown = () => {
    server.close(() => {
      process.exit(0)
    })
  }

  process.once('SIGTERM', shutdown)
  process.once('SIGINT', shutdown)
}