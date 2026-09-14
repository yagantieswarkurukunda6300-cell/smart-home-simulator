import { ROOMS, ROOM_ORDER } from '../house'
import VoiceControl from './VoiceControl'

function RoomTabIcon({ id }) {
  if (id === 'livingRoom')
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12l8-7 8 7" />
        <path d="M6 11v9h12v-9" />
        <path d="M10 20v-5h4v5" />
      </svg>
    )
  if (id === 'bedroom')
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10" />
        <path d="M3 13h18" />
        <path d="M8 11.5h2" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 10h16" />
      <path d="M10 16a2 2 0 0 1 4 0" />
    </svg>
  )
}

function ApplianceIcon({ type, on }) {
  const cls = `app-ico ${on ? 'on' : ''}`
  if (type === 'light')
    return (
      <span className={cls}>
        <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a5.5 5.5 0 0 0-3.8 9.6C8.9 13.3 9.5 14.1 9.5 15h5c0-.9.6-1.7 1.3-2.4A5.5 5.5 0 0 0 12 3Z" />
          <path d="M10 17h4" />
          <path d="M12 17v3" />
        </svg>
      </span>
    )
  if (type === 'fan')
    return (
      <span className={cls}>
        <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="10" r="3.5" />
          <path d="M10.5 6.5 15 3l3.5 2-1 3.5" />
          <path d="M13.5 6.5 11 11l-4.5-.5" />
          <path d="M12 13.5v6M9 19.5h6" />
        </svg>
      </span>
    )
  if (type === 'ac')
    return (
      <span className={cls}>
        <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="9" rx="2" />
          <path d="M6 12h12" />
          <path d="M12 15v2" />
          <path d="M8 17l-2 2M16 17l2 2" />
        </svg>
      </span>
    )
  if (type === 'tv')
    return (
      <span className={cls}>
        <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="11" rx="1.5" />
          <path d="M8 4.5l4 2.5 4-2.5" />
          <path d="M12 17v3M7.5 20h9" />
        </svg>
      </span>
    )
  if (type === 'lamp')
    return (
      <span className={cls}>
        <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 18h8" />
          <path d="M12 18v-7" />
          <path d="M9 11h6l2 4H7z" />
        </svg>
      </span>
    )
  if (type === 'exhaust')
    return (
      <span className={cls}>
        <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="11" r="8" />
          <circle cx="12" cy="11" r="3" />
          <path d="M12 3v4M12 15v4M4 11h4M16 11h4" />
        </svg>
      </span>
    )
  return (
    <span className={cls}>
      <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M5 10h14" />
        <path d="M9 6h1M9 13h3" />
      </svg>
    </span>
  )
}

function BluetoothIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 7.5 16.5 17 11.5 21V3l5 4-9 10" />
    </svg>
  )
}

function SignalIcon() {
  return (
    <svg viewBox="0 0 20 16" width="14" height="11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M2 14h2v-4H2zM7 14h2V7H7zM12 14h2V4h-2zM17 14h2V1h-2z" />
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg viewBox="0 0 24 20" width="16" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8a13 13 0 0 1 18 0" />
      <path d="M7 11.5a8 8 0 0 1 10 0" />
      <path d="M10.5 15a4 4 0 0 1 3 0" />
      <circle cx="12" cy="17.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg viewBox="0 0 28 16" width="22" height="13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="2" width="22" height="12" rx="3" />
      <path d="M24 6v4" />
      <path d="M3 4h4v8H3z" fill="currentColor" opacity=".35" />
      <path d="M7 4h5v8H7z" fill="currentColor" opacity=".25" />
      <path d="M12 4h5v8h-5z" fill="currentColor" opacity=".2" />
    </svg>
  )
}

export default function PhoneController({
  currentRoom,
  setRoom,
  states,
  onToggle,
  connected,
  connecting,
  onConnectToggle,
  onLightsOn,
  onLightsOff,
  onDevicesOff,
  onVoiceResult,
}) {
  const room = ROOMS[currentRoom]
  const roomStates = states[currentRoom]

  return (
    <div className={`phone ${connected ? 'is-connected' : 'is-disconnected'}`}>
      <span className="phone-btn top" />
      <span className="phone-btn bottom" />
      <span className="phone-notch" />
      <div className="phone-screen">
        <div className="phone-statusbar">
          <span className="time">9:41</span>
          <div className="icons">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>

        <div className="phone-header">
          <div className="ph-title">
            <h1>Smart Home</h1>
            <p>Bluetooth Controlled</p>
          </div>
          <button
            className={`bt-badge ${connected ? 'connected' : ''} ${connecting ? 'connecting' : ''}`}
            onClick={onConnectToggle}
            disabled={connecting}
            aria-label="Toggle Bluetooth connection"
          >
            <BluetoothIcon />
            <span className="bt-led" />
            <span>{connecting ? 'Pairing…' : connected ? 'Connected' : 'Disconnected'}</span>
          </button>
        </div>

        <div className="room-tabs" role="tablist" aria-label="Phone room selector">
          {ROOM_ORDER.map((id) => (
            <button
              key={id}
              role="tab"
              aria-selected={id === currentRoom}
              className={id === currentRoom ? 'active' : ''}
              onClick={() => setRoom(id)}
            >
              <RoomTabIcon id={id} />
              <span>{ROOMS[id].short}</span>
            </button>
          ))}
        </div>

        <div className="app-list">
          {room.appliances.map((app) => {
            const on = roomStates[app.id]
            return (
              <div
                key={app.id}
                className={`app-row ${on ? 'is-on' : ''}`}
              >
                <ApplianceIcon type={app.type} on={on} />
                <div className="app-meta">
                  <span className="name">{app.name}</span>
                  <span className="state">
                    <span className="mini-dot" />
                    {on ? 'On' : 'Off'}
                  </span>
                </div>
                <button
                  className={`switch ${on ? 'is-on' : ''}`}
                  role="switch"
                  aria-checked={on}
                  aria-label={`Toggle ${app.name}`}
                  onClick={() => onToggle(currentRoom, app.id)}
                  disabled={!connected}
                >
                  <span className="knob" />
                </button>
              </div>
            )
          })}
        </div>

        <div className="phone-section-label">Quick Controls</div>
        <div className="quick-controls">
          <button onClick={onLightsOn} disabled={!connected}>
            Lights ON
          </button>
          <button onClick={onLightsOff} disabled={!connected}>
            Lights OFF
          </button>
          <button className="danger" onClick={onDevicesOff} disabled={!connected}>
            All OFF
          </button>
        </div>

        <div className="phone-section-label">Voice Control</div>
        <VoiceControl
          connected={connected}
          currentRoomId={currentRoom}
          onResult={onVoiceResult}
        />
      </div>
    </div>
  )
}