import { useCallback, useEffect, useRef, useState } from 'react'
import { ROOM_ORDER, ROOMS } from './house'

const WS_PATH = '/ws'
const RETRY_DELAY = 2500
const MAX_RETRIES = 60

function normalizeState(states) {
  const out = {}
  for (const rid of ROOM_ORDER) {
    const src = states?.[rid]
    out[rid] = {}
    for (const app of ROOMS[rid].appliances) {
      out[rid][app.id] = typeof src?.[app.id] === 'boolean' ? src[app.id] : false
    }
  }
  return out
}

/**
 * Keeps the laptop simulator in real-time sync with phone clients over a
 * WebSocket hosted by this same app (see ws-server.js).
 *
 * @param {{ states: object, onRemoteState: (wireShape: object) => void }} args
 * @returns {{ status: 'connecting' | 'connected' | 'off', phones: number }}
 */
export function useLiveSync({ states, onRemoteState }) {
  const [status, setStatus] = useState('connecting')
  const [phones, setPhones] = useState(0)

  const wsRef = useRef(null)
  const remoteApplyRef = useRef(false)
  const lastSentRef = useRef(null)
  const statesRef = useRef(states)
  const onRemoteStateRef = useRef(onRemoteState)

  statesRef.current = states
  onRemoteStateRef.current = onRemoteState

  const sendSync = useCallback((wireState) => {
    const key = JSON.stringify(wireState)
    if (lastSentRef.current === key) return
    lastSentRef.current = key
    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'sync', state: wireState }))
    }
  }, [])

  // Publish local changes; skip when the change came from the hub.
  useEffect(() => {
    if (remoteApplyRef.current) {
      remoteApplyRef.current = false
      return
    }
    sendSync(normalizeState(states))
  }, [states, sendSync])

  useEffect(() => {
    let disposed = false
    let ws = null
    let retryTimer = null
    let retries = 0

    const scheduleRetry = () => {
      if (disposed) return
      retries += 1
      if (retries > MAX_RETRIES) {
        setStatus('off')
        return
      }
      retryTimer = setTimeout(connect, RETRY_DELAY)
    }

    function connect() {
      if (retryTimer) {
        clearTimeout(retryTimer)
        retryTimer = null
      }
      if (disposed) return

      const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
      const url = `${proto}://${window.location.host}${WS_PATH}`

      try {
        ws = new WebSocket(url)
      } catch {
        scheduleRetry()
        return
      }
      wsRef.current = ws

      ws.onopen = () => {
        if (disposed) return
        retries = 0
        setStatus('connected')
        ws.send(JSON.stringify({ type: 'hello', role: 'controller' }))
        ws.send(JSON.stringify({ type: 'sync', state: normalizeState(statesRef.current) }))
      }

      ws.onmessage = (event) => {
        if (disposed) return
        let msg
        try {
          msg = JSON.parse(event.data)
        } catch {
          return
        }
        if (!msg || typeof msg !== 'object') return

        if (msg.type === 'welcome') {
          setStatus('connected')
          if (typeof msg.phones === 'number') setPhones(msg.phones)
          if (msg.phoneDirty && msg.state) {
            // A phone has driven the house while we were away: adopt its state.
            remoteApplyRef.current = true
            onRemoteStateRef.current(msg.state)
          } else {
            // Hub is pristine: publish the home state we already hold.
            ws.send(JSON.stringify({ type: 'sync', state: normalizeState(statesRef.current) }))
          }
          return
        }

        if (msg.type === 'state') {
          if (msg.state) {
            remoteApplyRef.current = true
            onRemoteStateRef.current(msg.state)
          }
          return
        }

        if (msg.type === 'peers') {
          setPhones(typeof msg.phones === 'number' ? msg.phones : 0)
        }
      }

      ws.onerror = () => {
        // onclose always follows and schedules a retry
      }

      ws.onclose = () => {
        if (disposed) return
        wsRef.current = null
        setStatus('connecting')
        scheduleRetry()
      }
    }

    connect()

    return () => {
      disposed = true
      if (retryTimer) {
        clearTimeout(retryTimer)
        retryTimer = null
      }
      const active = ws
      wsRef.current = null
      if (active) {
        try {
          active.onopen = null
          active.onmessage = null
          active.onclose = null
          active.onerror = null
          active.close()
        } catch {
          /* already closed */
        }
      }
    }
  }, [])

  return { status, phones }
}