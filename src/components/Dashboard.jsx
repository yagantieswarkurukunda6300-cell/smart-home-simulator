import { ROOMS } from '../house'

function HomeMark() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10.5V20h14v-9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  )
}

export default function Dashboard({
  connected,
  connecting,
  currentRoomId,
  stats,
  hubStatus = 'connecting',
  phoneLinked = false,
  onLightsOn,
  onLightsOff,
  onDevicesOff,
}) {
  const btLabel = connecting ? 'Connecting…' : connected ? 'Bluetooth Connected' : 'Bluetooth Disconnected'
  const hubLabel =
    hubStatus === 'connected'
      ? phoneLinked
        ? 'Phone linked via Wi-Fi'
        : 'Hub online'
      : hubStatus === 'off'
        ? 'Hub unavailable'
        : 'Hub connecting…'
  const hubLedClass =
    hubStatus === 'connected' ? 'on' : hubStatus === 'off' ? 'hub-led-off' : 'connecting'

  return (
    <>
      <div className="brand">
        <div className="brand-mark">
          <HomeMark />
        </div>
        <div className="brand-text">
          <h1>Smart Home</h1>
          <p>Bluetooth Home Automation Simulator</p>
        </div>
      </div>

      <div className="dash">
        <span className="stat-chip">
          <span className={`led ${connected && !connecting ? 'on' : ''} ${connecting ? 'connecting' : ''}`} />
          <span className="chip-label">{btLabel}</span>
        </span>
        <span className="stat-chip">
          <span className={`led ${hubLedClass}`} />
          <span className="chip-label">{hubLabel}</span>
        </span>
        <span className="stat-chip">
          <span className="led room-led" />
          <span className="chip-label">Room: {ROOMS[currentRoomId].name}</span>
        </span>
        <span className="stat-chip">
          <span className="led on-amber" />
          <span className="chip-label">
            <b>{stats.on}</b> ON /{' '}
            <b>{stats.off}</b> OFF
          </span>
        </span>
        <span className="stat-chip">
          <span className="led status-led" />
          <span className="chip-label">{stats.homeStatus}</span>
        </span>
      </div>

      <div className="quickbar">
        <button className="quick-btn" onClick={onLightsOn} disabled={!connected}>
          All Lights ON
        </button>
        <button className="quick-btn" onClick={onLightsOff} disabled={!connected}>
          All Lights OFF
        </button>
        <button className="quick-btn is-critical" onClick={onDevicesOff} disabled={!connected}>
          All Devices OFF
        </button>
      </div>
    </>
  )
}