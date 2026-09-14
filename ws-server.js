import { createServer } from 'node:http'
import { WebSocketServer } from 'ws'
import { INITIAL_STATES, ROOM_ORDER, ROOMS } from './src/house.js'

/**
 * Smart Home live bridge.
 *
 * The laptop React/Vite app hosts this WebSocket server so any device on the
 * same LAN (the Expo mobile app) can mirror the virtual house in real time.
 *
 * Messages (JSON):
 *   client -> server: { type: 'hello', role: 'controller' | 'phone' }
 *                     { type: 'sync',  state: { <roomId>: { <appId>: bool } } }
 *                     { type: 'ping' }
 *   server -> client: { type: 'welcome', clientId, state, phoneDirty }
 *                     { type: 'state',   state }
 *                     { type: 'peers',   phones }
 *                     { type: 'pong' }
 *
 * The state shape is the laptop's own `applianceStates` shape so the two apps
 * exchange the exact same object.
 */

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
      if (typeof src[app.id] === 'boolean') out[rid][app.id] = src[app.id]
    }
  }
  return out
}

/**
 * Attach a live bridge WebSocketServer to an existing HTTP server.
 * @param {object} options
 * @param {import('node:http').Server} options.server Vite's HTTP server.
 * @param {string} [options.path] Upgrade path, default '/ws'.
 * @param {(msg: string) => void} [options.log]
 * @returns {{ wss: WebSocketServer, close: () => void }}
 */
export function createLiveServer({ server, path = DEFAULT_PATH, log = console.log } = {}) {
  let state = createEmptyState()
  let phoneDirty = false

  const clients = new Set()
  let seq = 0

  const wss = new WebSocketServer({ noServer: true })
  const handleUpgrade = (request, socket, head) => {
    const url = new URL(request.url, 'http://localhost')
    if (url.pathname !== path) return
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  }
  server.on('upgrade', handleUpgrade)

  function send(ws, obj) {
    if (ws.readyState === 1) ws.send(JSON.stringify(obj))
  }

  function totalPeers() {
    return clients.size
  }

  function phoneCount() {
    let n = 0
    for (const c of clients) if (c.role === 'phone') n += 1
    return n
  }

  function broadcast(obj, exceptWs = null) {
    const payload = JSON.stringify(obj)
    for (const c of clients) {
      if (c.ws === exceptWs) continue
      if (c.ws.readyState === 1) c.ws.send(payload)
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
    if (role === 'phone') phoneDirty = true
    return changed
  }

  wss.on('connection', (ws) => {
    const client = { ws, id: `c${++seq}`, role: 'controller' }
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
      if (!msg || typeof msg !== 'object') return

      if (msg.type === 'hello') {
        if (msg.role === 'phone') {
          client.role = 'phone'
          phoneDirty = true
        }
        broadcast({ type: 'peers', phones: phoneCount() }, client.ws)
        send(ws, { type: 'peers', phones: phoneCount() })
        return
      }

      if (msg.type === 'sync') {
        if (applySync(msg.state, client.role)) {
          broadcast({ type: 'state', state }, client.ws)
        }
        return
      }

      if (msg.type === 'ping') {
        send(ws, { type: 'pong' })
      }
    })

    ws.on('close', () => {
      clients.delete(client)
      broadcast({ type: 'peers', phones: phoneCount() })
    })

    ws.on('error', () => {
      clients.delete(client)
      broadcast({ type: 'peers', phones: phoneCount() })
    })
  })

  log(`Smart Home live bridge listening on path ${path}`)

  return {
    wss,
    close() {
      for (const c of clients) {
        try {
          c.ws.terminate()
        } catch {
          /* already closed */
        }
      }
      clients.clear()
      server.off('upgrade', handleUpgrade)
      wss.close()
    },
  }
}

if (process.argv[1] && new URL(import.meta.url).pathname === new URL(`file://${process.argv[1].replace(/\\/g, '/')}`).pathname) {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/plain' })
    response.end('Smart Home live bridge\n')
  })
  const live = createLiveServer({ server, path: DEFAULT_PATH })
  const port = Number(process.env.PORT) || 5173

  server.listen(port, '0.0.0.0', () => {
    console.log(`Smart Home live bridge listening on 0.0.0.0:${port}`)
  })

  const shutdown = () => {
    live.close()
    server.close(() => process.exit(0))
  }
  process.once('SIGTERM', shutdown)
  process.once('SIGINT', shutdown)
}