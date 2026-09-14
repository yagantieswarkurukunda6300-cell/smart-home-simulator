import { useCallback, useEffect, useMemo, useState } from 'react'
import { INITIAL_STATES, ROOMS, ROOM_ORDER, LIGHT_TYPES } from './house'
import VirtualHome from './components/VirtualHome'
import PhoneController from './components/PhoneController'
import Dashboard from './components/Dashboard'
import Toast from './components/Toast'
import { useLiveSync } from './useLiveSync'
import './App.css'
import './styles/rooms.css'
import './styles/phone.css'

const STORAGE_KEY = 'smart-home-sim-v1'
const clone = (value) => JSON.parse(JSON.stringify(value))

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null
    const states = {}
    for (const rid of ROOM_ORDER) {
      const saved = data.states && data.states[rid] ? data.states[rid] : {}
      states[rid] = { ...INITIAL_STATES[rid], ...saved }
      for (const app of ROOMS[rid].appliances) {
        if (typeof states[rid][app.id] !== 'boolean') states[rid][app.id] = INITIAL_STATES[rid][app.id]
      }
    }
    const room = ROOMS[data.room] ? data.room : 'livingRoom'
    return { states, room }
  } catch {
    return null
  }
}

function App() {
  const persisted = useMemo(() => loadPersisted(), [])
  const [applianceStates, setApplianceStates] = useState(() => persisted?.states ?? clone(INITIAL_STATES))
  const [currentRoom, setCurrentRoom] = useState(() => persisted?.room ?? 'livingRoom')
  const [connected, setConnected] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [toast, setToast] = useState(null)

  const handleRemoteState = useCallback((remote) => {
    setApplianceStates((prev) => {
      const next = clone(prev)
      for (const rid of ROOM_ORDER) {
        const src = remote[rid]
        if (!src || typeof src !== 'object') continue
        for (const app of ROOMS[rid].appliances) {
          if (typeof src[app.id] === 'boolean') next[rid][app.id] = src[app.id]
        }
      }
      return next
    })
  }, [])

  const hub = useLiveSync({ states: applianceStates, onRemoteState: handleRemoteState })

  const showToast = useCallback((msg, kind = 'info') => {
    setToast({ msg, kind, id: Date.now() })
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ states: applianceStates, room: currentRoom }),
      )
    } catch {
      /* storage unavailable */
    }
  }, [applianceStates, currentRoom])

  useEffect(() => {
    if (!toast) return undefined
    const id = setTimeout(() => setToast(null), 3400)
    return () => clearTimeout(id)
  }, [toast])

  const toggleAppliance = useCallback(
    (roomId, applianceId) => {
      if (!connected) {
        showToast('Connect the controller first', 'warn')
        return
      }
      const target = ROOMS[roomId].appliances.find((a) => a.id === applianceId)
      if (!target) return
      const nextValue = !applianceStates[roomId][applianceId]
      setApplianceStates((prev) => ({
        ...prev,
        [roomId]: { ...prev[roomId], [applianceId]: nextValue },
      }))
      showToast(`${target.name} turned ${nextValue ? 'ON' : 'OFF'}`, nextValue ? 'on' : 'off')
    },
    [connected, applianceStates, showToast],
  )

  const applyMany = useCallback((predicate, value) => {
    setApplianceStates((prev) => {
      const next = {}
      for (const rid of ROOM_ORDER) {
        next[rid] = { ...prev[rid] }
        for (const app of ROOMS[rid].appliances) {
          if (predicate(app)) next[rid][app.id] = value
        }
      }
      return next
    })
  }, [])

  const runLightAction = useCallback(
    (value) => {
      if (!connected) {
        showToast('Connect the controller first', 'warn')
        return false
      }
      applyMany((app) => LIGHT_TYPES.includes(app.type), value)
      showToast(value ? 'All lights turned ON' : 'All lights turned OFF', value ? 'on' : 'off')
      return true
    },
    [connected, applyMany, showToast],
  )

  const allLightsOn = useCallback(() => runLightAction(true), [runLightAction])
  const allLightsOff = useCallback(() => runLightAction(false), [runLightAction])

  const allDevicesOff = useCallback(() => {
    if (!connected) {
      showToast('Connect the controller first', 'warn')
      return
    }
    applyMany(() => true, false)
    showToast('All devices turned OFF', 'off')
  }, [connected, applyMany, showToast])

  const toggleConnection = useCallback(() => {
    if (connecting) return
    if (connected) {
      setConnected(false)
      showToast('Bluetooth disconnected', 'warn')
      return
    }
    setConnecting(true)
    setTimeout(() => {
      setConnecting(false)
      setConnected(true)
      showToast('Bluetooth connected', 'on')
    }, 1400)
  }, [connected, connecting, showToast])

  const handleVoiceResult = useCallback(
    (result) => {
      if (!connected) {
        showToast('Connect the controller first', 'warn')
        return
      }
      if (result.kind === 'unknown') {
        showToast(result.note || 'Command not recognized', 'warn')
        return
      }
      if (result.kind === 'connect') {
        if (connected) showToast('Bluetooth already connected', 'info')
        else {
          setConnected(true)
          showToast('Bluetooth connected via voice', 'on')
        }
        return
      }
      if (result.kind === 'disconnect') {
        if (!connected) showToast('Bluetooth already disconnected', 'info')
        else {
          setConnected(false)
          showToast('Bluetooth disconnected via voice', 'warn')
        }
        return
      }
      if (result.kind === 'allLights') {
        runLightAction(result.value)
        return
      }
      if (result.kind === 'allDevices') {
        applyMany(() => true, false)
        showToast('All devices turned OFF', 'off')
        return
      }
      if (result.kind === 'toggle') {
        const rid = result.roomId
        const names = result.applianceIds
          .map((id) => ROOMS[rid].appliances.find((a) => a.id === id))
          .filter(Boolean)
          .map((a) => a.name)
          .join(', ')
        setApplianceStates((prev) => {
          const nextRoom = { ...prev[rid] }
          for (const id of result.applianceIds) nextRoom[id] = result.value
          return { ...prev, [rid]: nextRoom }
        })
        if (result.setRoom) setCurrentRoom(rid)
        showToast(
          `${result.value ? 'Turned ON' : 'Turned OFF'} ${names || 'appliance'}`,
          result.value ? 'on' : 'off',
        )
      }
    },
    [connected, runLightAction, applyMany, showToast],
  )

  const stats = useMemo(() => {
    let on = 0
    let off = 0
    for (const rid of ROOM_ORDER) {
      for (const id of Object.keys(applianceStates[rid])) {
        if (applianceStates[rid][id]) on += 1
        else off += 1
      }
    }
    const homeStatus = !connected
      ? 'Disconnected'
      : on === 0
        ? 'All devices off'
        : off === 0
          ? 'Fully active'
          : 'Monitoring'
    return { on, off, homeStatus }
  }, [applianceStates, connected])

  return (
    <div className="app">
      <header className="topbar">
        <Dashboard
          connected={connected}
          connecting={connecting}
          currentRoomId={currentRoom}
          stats={stats}
          hubStatus={hub.status}
          phoneLinked={hub.phones > 0}
          onLightsOn={allLightsOn}
          onLightsOff={allLightsOff}
          onDevicesOff={allDevicesOff}
        />
      </header>

      <main className="main">
        <section className="home-panel">
          <VirtualHome
            roomId={currentRoom}
            setRoom={setCurrentRoom}
            states={applianceStates}
            connected={connected}
          />
        </section>
        <aside className="phone-panel">
          <PhoneController
            currentRoom={currentRoom}
            setRoom={setCurrentRoom}
            states={applianceStates}
            onToggle={toggleAppliance}
            connected={connected}
            connecting={connecting}
            onConnectToggle={toggleConnection}
            onLightsOn={allLightsOn}
            onLightsOff={allLightsOff}
            onDevicesOff={allDevicesOff}
            onVoiceResult={handleVoiceResult}
          />
        </aside>
      </main>

      <footer className="footer">
        Bluetooth Home Automation &middot; Software simulator &middot; no real hardware or
        Bluetooth radios are used &middot; Live Wi-Fi sync on <code>ws://&lt;your-ip&gt;:5173/ws</code>
      </footer>

      {toast && <Toast key={toast.id} toast={toast} />}
    </div>
  )
}

export default App