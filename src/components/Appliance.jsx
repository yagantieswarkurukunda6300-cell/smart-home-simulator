function LightBody() {
  return (
    <div className="alight">
      <span className="alight-canopy" />
      <span className="alight-cord" />
      <span className="alight-shade">
        <span className="alight-globe" />
        <span className="alight-ring" />
      </span>
      <span className="alight-rays" />
      <span className="alight-cone" />
      <span className="alight-pool" />
    </div>
  )
}

function LampBody() {
  return (
    <div className="alamp">
      <span className="alamp-shade">
        <span className="alamp-bulb" />
        <span className="alamp-glow" />
      </span>
      <span className="alamp-pole" />
      <span className="alamp-base" />
      <span className="alamp-pool" />
    </div>
  )
}

function FanSvg() {
  return (
    <svg className="fan-svg" viewBox="0 0 120 150" aria-hidden="true">
      <defs>
        <linearGradient id="fan-rod-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c8ba4" />
          <stop offset="1" stopColor="#2a3350" />
        </linearGradient>
        <radialGradient id="fan-motor-g" cx="0.42" cy="0.35" r="0.85">
          <stop offset="0" stopColor="#5c6d92" />
          <stop offset="0.65" stopColor="#37435f" />
          <stop offset="1" stopColor="#1b2336" />
        </radialGradient>
        <linearGradient id="fan-blade-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c0f1ff" />
          <stop offset="0.5" stopColor="#70a8d8" />
          <stop offset="1" stopColor="#3b5f8f" />
        </linearGradient>
      </defs>
      <rect x="52" y="1" width="16" height="9" rx="4" fill="#101828" />
      <rect x="56" y="6" width="8" height="40" rx="4" fill="url(#fan-rod-g)" />
      <rect x="53" y="42" width="14" height="8" rx="4" fill="#2a3350" />
      <path d="M48 46 h24 a6 6 0 0 1 6 6 v3 h-36 v-3 a6 6 0 0 1 6 -6 Z" fill="url(#fan-motor-g)" />
      <g className="blades">
        {[0, 120, 240].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 60 62)`}>
            <path
              d="M60 62 C 68 50 88 44 104 46 C 107 60 84 78 60 62 Z"
              fill="url(#fan-blade-g)"
              opacity="0.96"
            />
            <path
              d="M60 62 C 64 55 77 49 90 49 C 86 56 71 63 60 62 Z"
              fill="#eafaff"
              opacity="0.5"
            />
            <path d="M60 62 L 60 66 L 100 50" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.18" />
          </g>
        ))}
      </g>
      <circle cx="60" cy="62" r="12" fill="url(#fan-motor-g)" stroke="#6f86b2" strokeWidth="1.5" />
      <circle cx="60" cy="62" r="6" fill="#16203a" />
      <circle cx="60" cy="62" r="2.6" fill="#a7ecff" />
      <path d="M60 76 v14" stroke="#2c3a5c" strokeWidth="2" />
      <circle cx="60" cy="92" r="3.2" fill="#101828" />
    </svg>
  )
}

function ExhaustSvg() {
  return (
    <svg className="exhaust-svg" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="exh-body-g" cx="0.4" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#5c6d92" />
          <stop offset="1" stopColor="#141d36" />
        </radialGradient>
        <linearGradient id="exh-rod-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c8ba4" />
          <stop offset="1" stopColor="#2a3350" />
        </linearGradient>
        <linearGradient id="exh-blade-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d6f5ff" />
          <stop offset="0.5" stopColor="#7fb6e8" />
          <stop offset="1" stopColor="#47729f" />
        </linearGradient>
      </defs>
      <rect x="36" y="0" width="28" height="10" rx="4" fill="#101828" />
      <rect x="42" y="8" width="16" height="12" rx="4" fill="url(#exh-rod-g)" />
      <circle cx="50" cy="50" r="47" fill="url(#exh-body-g)" />
      <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="41" fill="#0e1630" stroke="#3b4c70" strokeWidth="3" />
      <circle cx="50" cy="50" r="24" fill="#152040" stroke="#46618f" strokeWidth="1.5" />
      <g className="blades">
        {[0, 120, 240].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 50 50)`}>
            <path
              d="M50 50 C 57 42 72 37 89 40 C 91 54 70 66 50 50 Z"
              fill="url(#exh-blade-g)"
              opacity="0.95"
            />
            <path
              d="M50 50 C 54 45 65 41 77 42 C 73 49 60 55 50 50 Z"
              fill="#eafaff"
              opacity="0.5"
            />
          </g>
        ))}
      </g>
      <circle cx="50" cy="50" r="9" fill="#26334f" stroke="#6f86b2" strokeWidth="2" />
      <circle cx="50" cy="50" r="3" fill="#a7ecff" />
      <g stroke="#3b4c70" strokeWidth="3" strokeLinecap="round">
        <path d="M50 6 v12" />
        <path d="M50 82 v12" />
        <path d="M6 50 h12" />
        <path d="M82 50 h12" />
      </g>
    </svg>
  )
}

function AcBody() {
  return (
    <div className="aac">
      <span className="aac-shadow" />
      <div className="aac-body">
        <span className="aac-brand">AURORA</span>
        <span className="aac-lcd">
          <b>22°</b>
        </span>
        <span className="aac-grill" />
        <span className="aac-slat" />
        <span className="aac-slat" />
        <span className="aac-slat" />
        <span className="aac-led" />
        <span className="aac-ventline" />
      </div>
      <div className="aac-mist">
        <span />
        <span />
        <span />
        <span />
      </div>
      <span className="aac-temp">Cooling 22°C</span>
    </div>
  )
}

function TvBody({ on }) {
  return (
    <div className="atv">
      <div className="atv-bezel">
        <span className="atv-cam" />
        <div className={`atv-screen ${on ? 'is-live' : 'atv-screen--off'}`}>
          {on && (
            <>
              <span className="atv-video" />
              <span className="atv-scan" />
              <span className="atv-hud">
                <span className="atv-bar b1" />
                <span className="atv-bar b2" />
                <span className="atv-bar b3" />
                <span className="atv-bar b4" />
                <span className="atv-ticker">SMART HOME SYSTEM · LIVE FEED · 4K ULTRA HD</span>
              </span>
              <span className="atv-glow" />
            </>
          )}
        </div>
        <span className="atv-footprint">
          <span className="atv-power" />
        </span>
      </div>
      <span className="atv-neck" />
      <span className="atv-foot" />
    </div>
  )
}

function FridgeBody() {
  return (
    <div className="afridge">
      <span className="afridge-shadow" />
      <span className="afridge-door top">
        <span className="afridge-brand">FROST</span>
        <span className="afridge-inner" />
        <span className="afridge-handle" />
      </span>
      <span className="afridge-door bottom">
        <span className="afridge-shelf-line" />
        <span className="afridge-shelf-line s2" />
        <span className="afridge-handle" />
      </span>
      <span className="afridge-led" />
      <span className="afridge-vent">
        <span />
        <span />
        <span />
      </span>
    </div>
  )
}

const BODIES = {
  light: LightBody,
  lamp: LampBody,
  fan: FanSvg,
  exhaust: ExhaustSvg,
  ac: AcBody,
  tv: TvBody,
  refrigerator: FridgeBody,
}

export default function Appliance({ type, name, on }) {
  const Body = BODIES[type]
  return (
    <div
      className={`appliance appliance--${type} ${on ? 'is-on' : 'is-off'}`}
      aria-label={`${name} - ${on ? 'ON' : 'OFF'}`}
    >
      {Body && <Body on={on} />}
      <span className="appliance-chip">
        <span className="dot" />
        {name}
      </span>
    </div>
  )
}