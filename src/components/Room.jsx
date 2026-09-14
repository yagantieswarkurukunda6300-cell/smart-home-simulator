import { ROOMS, LIGHT_TYPES } from '../house'
import Appliance from './Appliance'

function Sofa() {
  return (
    <svg className="furniture f-sofa" viewBox="0 0 440 214" aria-hidden="true">
      <defs>
        <linearGradient id="sofa-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5c6ea0" />
          <stop offset="0.5" stopColor="#43527d" />
          <stop offset="1" stopColor="#27324f" />
        </linearGradient>
        <linearGradient id="sofa-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d5d8d" />
          <stop offset="1" stopColor="#202a45" />
        </linearGradient>
        <linearGradient id="sofa-seat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b7db0" />
          <stop offset="0.55" stopColor="#4d5e8d" />
          <stop offset="1" stopColor="#333f66" />
        </linearGradient>
        <linearGradient id="sofa-arm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6a7bb0" />
          <stop offset="0.3" stopColor="#4c5c88" />
          <stop offset="1" stopColor="#2a3554" />
        </linearGradient>
        <linearGradient id="sofa-plinth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#31405f" />
          <stop offset="1" stopColor="#181f34" />
        </linearGradient>
        <linearGradient id="sofa-leg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a0713f" />
          <stop offset="1" stopColor="#5a3c1e" />
        </linearGradient>
        <linearGradient id="pillow-accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d08a5a" />
          <stop offset="1" stopColor="#93522f" />
        </linearGradient>
        <linearGradient id="pillow-sand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6d7bd" />
          <stop offset="1" stopColor="#b89a6f" />
        </linearGradient>
      </defs>

      <ellipse cx="220" cy="206" rx="206" ry="11" fill="rgba(0,0,0,0.5)" />

      {/* legs */}
      <rect x="58" y="176" width="14" height="30" rx="7" fill="url(#sofa-leg)" />
      <rect x="368" y="176" width="14" height="30" rx="7" fill="url(#sofa-leg)" />
      <rect x="140" y="178" width="12" height="26" rx="6" fill="url(#sofa-leg)" opacity="0.85" />
      <rect x="288" y="178" width="12" height="26" rx="6" fill="url(#sofa-leg)" opacity="0.85" />

      {/* plinth base */}
      <rect x="52" y="146" width="336" height="48" rx="12" fill="url(#sofa-plinth)" />
      <rect x="52" y="146" width="336" height="5" rx="2.5" fill="rgba(255,255,255,0.09)" />
      <rect x="66" y="168" width="18" height="16" rx="8" fill="#111a2b" />
      <rect x="356" y="168" width="18" height="16" rx="8" fill="#111a2b" />

      {/* arms */}
      <rect x="26" y="58" width="46" height="108" rx="20" fill="url(#sofa-arm)" />
      <rect x="368" y="58" width="46" height="108" rx="20" fill="url(#sofa-arm)" />
      <rect x="30" y="62" width="32" height="100" rx="15" fill="rgba(255,255,255,0.09)" />
      <rect x="372" y="62" width="32" height="100" rx="15" fill="rgba(255,255,255,0.09)" />
      <rect x="26" y="152" width="46" height="12" rx="6" fill="rgba(0,0,0,0.35)" />
      <rect x="368" y="152" width="46" height="12" rx="6" fill="rgba(0,0,0,0.35)" />

      {/* backrest */}
      <rect x="52" y="34" width="336" height="108" rx="18" fill="url(#sofa-back)" />
      <rect x="52" y="34" width="336" height="9" rx="4.5" fill="rgba(255,255,255,0.13)" />

      {/* back cushions */}
      <rect x="66" y="66" width="100" height="72" rx="14" fill="url(#sofa-body)" />
      <rect x="170" y="66" width="100" height="72" rx="14" fill="url(#sofa-body)" />
      <rect x="274" y="66" width="100" height="72" rx="14" fill="url(#sofa-body)" />
      <rect x="72" y="72" width="88" height="8" rx="4" fill="rgba(255,255,255,0.11)" />
      <rect x="176" y="72" width="88" height="8" rx="4" fill="rgba(255,255,255,0.11)" />
      <rect x="280" y="72" width="88" height="8" rx="4" fill="rgba(255,255,255,0.11)" />

      {/* seat cushions */}
      <rect x="64" y="112" width="98" height="38" rx="12" fill="url(#sofa-seat)" />
      <rect x="171" y="112" width="98" height="38" rx="12" fill="url(#sofa-seat)" />
      <rect x="278" y="112" width="98" height="38" rx="12" fill="url(#sofa-seat)" />
      <rect x="66" y="114" width="94" height="7" rx="3.5" fill="rgba(255,255,255,0.22)" />
      <rect x="173" y="114" width="94" height="7" rx="3.5" fill="rgba(255,255,255,0.22)" />
      <rect x="280" y="114" width="94" height="7" rx="3.5" fill="rgba(255,255,255,0.22)" />
      <rect x="64" y="142" width="98" height="6" rx="3" fill="rgba(0,0,0,0.3)" />
      <rect x="171" y="142" width="98" height="6" rx="3" fill="rgba(0,0,0,0.3)" />
      <rect x="278" y="142" width="98" height="6" rx="3" fill="rgba(0,0,0,0.3)" />

      {/* throw pillows */}
      <g transform="rotate(-7 97 70)">
        <rect x="74" y="52" width="46" height="38" rx="10" fill="url(#pillow-accent)" />
        <rect x="78" y="56" width="38" height="5" rx="2.5" fill="rgba(255,255,255,0.28)" />
        <rect x="90" y="72" width="14" height="4" rx="2" fill="rgba(255,255,255,0.18)" />
      </g>
      <g transform="rotate(6 345 70)">
        <rect x="322" y="52" width="46" height="38" rx="10" fill="url(#pillow-sand)" />
        <rect x="326" y="56" width="38" height="5" rx="2.5" fill="rgba(255,255,255,0.34)" />
        <rect x="338" y="72" width="14" height="4" rx="2" fill="rgba(255,255,255,0.22)" />
      </g>
    </svg>
  )
}

function CoffeeTable() {
  return (
    <svg className="furniture f-coffee" viewBox="0 0 280 124" aria-hidden="true">
      <defs>
        <linearGradient id="ct-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#93a0bd" />
          <stop offset="0.5" stopColor="#5f6b88" />
          <stop offset="1" stopColor="#3b465e" />
        </linearGradient>
        <linearGradient id="ct-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a546e" />
          <stop offset="1" stopColor="#222b3e" />
        </linearGradient>
        <linearGradient id="ct-leg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a7440" />
          <stop offset="1" stopColor="#4a3a1e" />
        </linearGradient>
      </defs>

      <ellipse cx="140" cy="118" rx="132" ry="8" fill="rgba(0,0,0,0.5)" />

      {/* legs */}
      <rect x="40" y="80" width="10" height="34" rx="5" fill="url(#ct-leg)" />
      <rect x="230" y="80" width="10" height="34" rx="5" fill="url(#ct-leg)" />
      <rect x="66" y="82" width="8" height="32" rx="4" fill="url(#ct-leg)" opacity="0.8" />
      <rect x="206" y="82" width="8" height="32" rx="4" fill="url(#ct-leg)" opacity="0.8" />

      {/* underside apron */}
      <rect x="26" y="64" width="228" height="16" rx="8" fill="#1a2134" />
      {/* top surface */}
      <rect x="20" y="24" width="240" height="42" rx="12" fill="url(#ct-top)" />
      <rect x="26" y="28" width="228" height="5" rx="2.5" fill="rgba(255,255,255,0.38)" />
      <rect x="26" y="56" width="228" height="4" rx="2" fill="rgba(0,0,0,0.35)" />

      {/* decor: book stack */}
      <rect x="60" y="16" width="64" height="7" rx="3" fill="#b0603f" />
      <rect x="64" y="9" width="56" height="7" rx="3" fill="#d1a13f" />
      <rect x="68" y="3" width="48" height="6" rx="3" fill="#3f5d8c" />

      {/* potted plant */}
      <path d="M196 24 C 192 12 200 10 196 24 Z" fill="#7fae5d" opacity="0.9" />
      <path d="M200 20 C 200 8 208 8 202 20 Z" fill="#5d9c4a" opacity="0.9" />
      <rect x="192" y="22" width="14" height="10" rx="3" fill="#9a5b3a" />

      {/* mug with saucer */}
      <ellipse cx="152" cy="24" rx="11" ry="3" fill="#cdd5e2" />
      <rect x="146" y="12" width="12" height="13" rx="3" fill="#e9eef8" />
      <rect x="158" y="15" width="4" height="6" rx="2" fill="#e9eef8" />
    </svg>
  )
}

function TvUnit() {
  return (
    <svg className="furniture f-tvunit" viewBox="0 0 300 150" aria-hidden="true">
      <defs>
        <linearGradient id="tvunit-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#525e80" />
          <stop offset="0.14" stopColor="#3d4866" />
          <stop offset="0.55" stopColor="#2f3750" />
          <stop offset="1" stopColor="#1c2338" />
        </linearGradient>
        <linearGradient id="tvunit-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a7799" />
          <stop offset="1" stopColor="#3a4663" />
        </linearGradient>
        <linearGradient id="tvunit-door" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#454f6e" />
          <stop offset="1" stopColor="#262e45" />
        </linearGradient>
      </defs>

      <ellipse cx="150" cy="144" rx="142" ry="9" fill="rgba(0,0,0,0.5)" />
      <rect x="22" y="128" width="12" height="18" rx="6" fill="#141a2c" />
      <rect x="266" y="128" width="12" height="18" rx="6" fill="#141a2c" />

      {/* cabinet */}
      <rect x="18" y="92" width="264" height="40" rx="8" fill="url(#tvunit-body)" />
      <rect x="18" y="90" width="264" height="12" rx="7" fill="url(#tvunit-top)" />

      {/* cabinet doors */}
      <rect x="26" y="100" width="108" height="26" rx="6" fill="url(#tvunit-door)" />
      <rect x="166" y="100" width="108" height="26" rx="6" fill="url(#tvunit-door)" />
      <rect x="30" y="104" width="100" height="3" rx="1.5" fill="rgba(255,255,255,0.1)" />
      <rect x="170" y="104" width="100" height="3" rx="1.5" fill="rgba(255,255,255,0.1)" />
      <rect x="120" y="106" width="5" height="14" rx="2.5" fill="#a0712f" />
      <rect x="175" y="106" width="5" height="14" rx="2.5" fill="#a0712f" />

      {/* soundbar on top */}
      <rect x="96" y="82" width="108" height="8" rx="4" fill="#10141f" />
      <rect x="102" y="84" width="96" height="3" rx="1.5" fill="rgba(255,255,255,0.07)" />
      <circle cx="198" cy="86" r="1.2" fill="#34d399" opacity="0.85" />

      {/* small objects */}
      <rect x="28" y="78" width="24" height="12" rx="3" fill="#c96a3f" />
      <rect x="30" y="82" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
      <rect x="248" y="80" width="22" height="20" rx="5" fill="#34496b" />
      <rect x="252" y="84" width="14" height="8" rx="2" fill="#7fd8ff" opacity="0.8" />
    </svg>
  )
}

function WallArt() {
  return (
    <>
      <span className="wall-art art-a" />
      <span className="wall-art art-b" />
    </>
  )
}

function Plant({ variant = 'shelf' }) {
  return (
    <span className={`decor-plant plant--${variant}`}>
      <span className="plant-foliage" />
      <span className="plant-pot" />
    </span>
  )
}

function Bed() {
  return (
    <svg className="furniture f-bed" viewBox="0 0 500 282" aria-hidden="true">
      <defs>
        <linearGradient id="bed-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a6a45" />
          <stop offset="0.35" stopColor="#5f4730" />
          <stop offset="1" stopColor="#35261b" />
        </linearGradient>
        <linearGradient id="bed-frame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d3a28" />
          <stop offset="1" stopColor="#241a12" />
        </linearGradient>
        <linearGradient id="bed-mattress" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbfcfe" />
          <stop offset="0.7" stopColor="#e6ebf3" />
          <stop offset="1" stopColor="#c2c9d6" />
        </linearGradient>
        <linearGradient id="bed-duvet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8aa0c8" />
          <stop offset="0.5" stopColor="#64749e" />
          <stop offset="1" stopColor="#465478" />
        </linearGradient>
        <linearGradient id="bed-pillow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#cfd5de" />
        </linearGradient>
        <linearGradient id="bed-throw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9815c" />
          <stop offset="1" stopColor="#7c4a31" />
        </linearGradient>
        <linearGradient id="bed-sheet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f7fb" />
          <stop offset="1" stopColor="#d5dce6" />
        </linearGradient>
      </defs>

      <ellipse cx="250" cy="272" rx="234" ry="12" fill="rgba(0,0,0,0.5)" />

      {/* platform base */}
      <rect x="28" y="206" width="444" height="58" rx="12" fill="url(#bed-frame)" />
      <rect x="28" y="206" width="444" height="9" rx="4.5" fill="rgba(255,255,255,0.1)" />
      <rect x="60" y="256" width="18" height="14" rx="7" fill="#121018" />
      <rect x="422" y="256" width="18" height="14" rx="7" fill="#121018" />

      {/* headboard */}
      <rect x="66" y="18" width="368" height="150" rx="16" fill="url(#bed-head)" />
      <rect x="86" y="30" width="92" height="126" rx="10" fill="rgba(0,0,0,0.16)" />
      <rect x="204" y="30" width="92" height="126" rx="10" fill="rgba(0,0,0,0.16)" />
      <rect x="322" y="30" width="92" height="126" rx="10" fill="rgba(0,0,0,0.16)" />
      <rect x="66" y="18" width="368" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
      <rect x="66" y="132" width="368" height="4" rx="2" fill="rgba(0,0,0,0.3)" />

      {/* shadow cast onto mattress by headboard */}
      <rect x="44" y="138" width="412" height="12" fill="rgba(30,20,12,0.16)" />

      {/* mattress */}
      <rect x="44" y="136" width="412" height="72" rx="16" fill="url(#bed-mattress)" />
      <rect x="52" y="139" width="396" height="8" rx="4" fill="#ffffff" />

      {/* pillows */}
      <g transform="rotate(-2 140 126)">
        <rect x="74" y="104" width="132" height="46" rx="14" fill="url(#bed-pillow)" />
        <rect x="80" y="110" width="120" height="8" rx="4" fill="rgba(255,255,255,0.95)" />
        <path d="M118 118 q22 -8 44 0" stroke="#b9c1ce" strokeWidth="2.5" fill="none" opacity="0.7" />
      </g>
      <g transform="rotate(2 362 126)">
        <rect x="296" y="104" width="132" height="46" rx="14" fill="url(#bed-pillow)" />
        <rect x="302" y="110" width="120" height="8" rx="4" fill="rgba(255,255,255,0.95)" />
        <path d="M340 118 q22 -8 44 0" stroke="#b9c1ce" strokeWidth="2.5" fill="none" opacity="0.7" />
      </g>

      {/* folded sheet band */}
      <rect x="50" y="186" width="400" height="14" rx="7" fill="url(#bed-sheet)" />

      {/* duvet */}
      <path d="M52 200 h396 v32 a14 14 0 0 1 -14 14 H66 a14 14 0 0 1 -14 -14 Z" fill="url(#bed-duvet)" />
      <rect x="52" y="200" width="396" height="10" rx="5" fill="rgba(255,255,255,0.2)" />
      <path d="M56 214 h388" stroke="#3a4777" strokeWidth="2" opacity="0.45" />
      <path d="M64 232 q40 -8 80 0 q40 -8 80 0 q40 -8 80 0 q40 -8 80 0 q36 -8 72 0" stroke="#33406b" strokeWidth="2" fill="none" opacity="0.3" />
      <rect x="48" y="196" width="14" height="34" rx="7" fill="#4a5a85" />
      <rect x="438" y="196" width="14" height="34" rx="7" fill="#4a5a85" />

      {/* foot throw */}
      <rect x="188" y="214" width="124" height="34" rx="10" fill="url(#bed-throw)" />
      <rect x="194" y="218" width="112" height="5" rx="2.5" fill="rgba(255,255,255,0.26)" />
    </svg>
  )
}

function BedsideTable() {
  return (
    <svg className="furniture f-bedside" viewBox="0 0 170 150" aria-hidden="true">
      <defs>
        <linearGradient id="bs-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a7a9c" />
          <stop offset="0.55" stopColor="#46546f" />
          <stop offset="1" stopColor="#2a3448" />
        </linearGradient>
        <linearGradient id="bs-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c8bad" />
          <stop offset="1" stopColor="#46546d" />
        </linearGradient>
      </defs>

      <ellipse cx="85" cy="144" rx="78" ry="7" fill="rgba(0,0,0,0.48)" />
      <rect x="22" y="112" width="10" height="30" rx="5" fill="#202a40" />
      <rect x="138" y="112" width="10" height="30" rx="5" fill="#202a40" />

      {/* cabinet body */}
      <rect x="24" y="56" width="122" height="58" rx="8" fill="url(#bs-g)" />
      <rect x="24" y="48" width="122" height="16" rx="8" fill="url(#bs-top)" />
      <rect x="28" y="51" width="114" height="4" rx="2" fill="rgba(255,255,255,0.32)" />

      {/* drawer */}
      <rect x="34" y="68" width="102" height="20" rx="6" fill="rgba(255,255,255,0.05)" />
      <rect x="38" y="72" width="94" height="3" rx="1.5" fill="rgba(255,255,255,0.13)" />
      <rect x="116" y="75" width="5" height="9" rx="2.5" fill="#a0712f" />

      {/* lower shelf shadow */}
      <rect x="34" y="92" width="102" height="3" fill="rgba(0,0,0,0.35)" />

      {/* books on top */}
      <rect x="44" y="36" width="38" height="9" rx="3" fill="#3f5d8c" />
      <rect x="46" y="29" width="34" height="8" rx="2.5" fill="#c96a3f" />
      <rect x="88" y="34" width="26" height="12" rx="3" fill="#7a8aa8" />
    </svg>
  )
}

function Wardrobe() {
  return (
    <svg className="furniture f-wardrobe" viewBox="0 0 300 380" aria-hidden="true">
      <defs>
        <linearGradient id="wr-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5c6b8f" />
          <stop offset="0.2" stopColor="#47537a" />
          <stop offset="0.6" stopColor="#3a4560" />
          <stop offset="1" stopColor="#28304a" />
        </linearGradient>
        <linearGradient id="wr-door" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a5678" />
          <stop offset="1" stopColor="#303a54" />
        </linearGradient>
        <linearGradient id="wr-crown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f7fa2" />
          <stop offset="1" stopColor="#3c4766" />
        </linearGradient>
      </defs>

      <ellipse cx="150" cy="372" rx="142" ry="10" fill="rgba(0,0,0,0.5)" />
      <rect x="96" y="362" width="14" height="16" rx="6" fill="#141a2c" />
      <rect x="190" y="362" width="14" height="16" rx="6" fill="#141a2c" />

      {/* plinth */}
      <rect x="16" y="352" width="268" height="16" rx="6" fill="#1a2134" />

      {/* crown */}
      <rect x="18" y="14" width="264" height="22" rx="8" fill="url(#wr-crown)" />
      <rect x="22" y="18" width="256" height="6" rx="3" fill="rgba(255,255,255,0.18)" />

      {/* body */}
      <rect x="18" y="24" width="264" height="330" rx="10" fill="url(#wr-body)" />
      <rect x="26" y="44" width="118" height="300" rx="8" fill="url(#wr-door)" />
      <rect x="156" y="44" width="118" height="300" rx="8" fill="url(#wr-door)" />

      {/* door panels */}
      <rect x="34" y="56" width="102" height="118" rx="6" fill="rgba(0,0,0,0.13)" />
      <rect x="164" y="56" width="102" height="118" rx="6" fill="rgba(0,0,0,0.13)" />
      <rect x="34" y="188" width="102" height="118" rx="6" fill="rgba(0,0,0,0.13)" />
      <rect x="164" y="188" width="102" height="118" rx="6" fill="rgba(0,0,0,0.13)" />

      {/* center seams */}
      <rect x="136" y="150" width="28" height="10" rx="4" fill="#151c30" />
      <rect x="136" y="312" width="28" height="10" rx="4" fill="#151c30" />
      <path d="M138 44 v116 M138 240 v104" stroke="#151c30" strokeWidth="4" opacity="0.4" />

      {/* handles */}
      <rect x="142" y="52" width="7" height="150" rx="3.5" fill="#0f1524" />
      <rect x="151" y="52" width="7" height="150" rx="3.5" fill="#0f1524" />
      <rect x="142" y="230" width="7" height="108" rx="3.5" fill="#0f1524" />
      <rect x="151" y="230" width="7" height="108" rx="3.5" fill="#0f1524" />

      {/* top edge light */}
      <rect x="26" y="46" width="118" height="6" rx="3" fill="rgba(255,255,255,0.12)" />
      <rect x="156" y="46" width="118" height="6" rx="3" fill="rgba(255,255,255,0.12)" />
    </svg>
  )
}

function KitchenFurniture() {
  return (
    <>
      <span className="k-counter left">
        <span className="k-top" />
        <span className="k-door d1" />
        <span className="k-door d2" />
        <span className="k-drawer" />
        <span className="k-pot" />
        <span className="k-jar" />
        <span className="k-plate" />
      </span>

      <span className="k-counter right">
        <span className="k-top" />
        <span className="k-door d3" />
        <span className="k-door d4" />
        <span className="k-drawer" />
        <span className="k-sink">
          <span className="sink-basin" />
          <span className="faucet" />
        </span>
        <span className="k-kettle" />
        <span className="k-fruit" />
      </span>

      <span className="k-island">
        <span className="k-top" />
        <span className="k-stove">
          <span className="burner burner-a" />
          <span className="burner burner-b" />
          <span className="burner burner-c" />
          <span className="burner burner-d" />
        </span>
        <span className="k-knobs">
          <span className="knob" />
          <span className="knob" />
          <span className="knob" />
          <span className="knob" />
        </span>
        <span className="k-oven" />
        <span className="k-doordiv" />
        <span className="k-doordiv d2" />
      </span>

      <span className="k-hood">
        <span className="k-duct" />
        <span className="hood-body" />
        <span className="hood-plate" />
        <span className="hood-light" />
      </span>
    </>
  )
}

function WallClock() {
  return (
    <span className="wall-clock">
      <span className="clock-face">
        <span className="clock-tick t1" />
        <span className="clock-tick t2" />
        <span className="clock-tick t3" />
        <span className="clock-tick t4" />
        <span className="clock-hand hour" />
        <span className="clock-hand minute" />
      </span>
    </span>
  )
}

export default function Room({ roomId, states }) {
  const room = ROOMS[roomId]
  const current = states[roomId]
  const anyLightOn = room.appliances.some(
    (a) => LIGHT_TYPES.includes(a.type) && current[a.id],
  )

  return (
    <div className={`room room--${roomId} ${anyLightOn ? 'room--lit' : ''}`}>
      <div className="room-scene">
        <div className="room-ceiling">
          <span className="ceil-cove left" />
          <span className="ceil-cove right" />
          <span className="ceil-molding" />
        </div>

        <div className="room-backwall">
          <span className="wall-sheen" />
          <span className="wall-texture" />
          <span className="wall-glow" />
          <span className="wainscot" />
          <span className="wainscot-line" />
          <span className="baseboard" />

          {roomId === 'livingRoom' && (
            <>
              <span className="tv-accent" />
              <WallArt />
              <Plant variant="shelf" />
            </>
          )}
          {roomId === 'bedroom' && (
            <>
              <WallClock />
              <span className="wall-art art-c" />
              <Plant variant="floor" />
            </>
          )}
          {roomId === 'kitchen' && (
            <>
              <span className="backsplash" />
              <span className="backsplash-line" />
              <span className="kitchen-upper left" />
              <span className="kitchen-upper right" />
            </>
          )}

          <div className="room-window">
            <span className="win-curtain">
              <span className="curtain-panel left" />
              <span className="curtain-panel right" />
              <span className="curtain-rod" />
            </span>
            <span className="win-sky">
              <span className="win-stars" />
              <span className="win-moon" />
              <span className="win-hills" />
            </span>
            <span className="win-frame" />
            <span className="win-cross" />
            <span className="win-glass" />
            <span className="win-sill" />
          </div>
        </div>

        <div className="room-floor">
          <span className="floor-planks" />
          <span className="floor-tints" />
          <span className="floor-sheen" />
          <span className="floor-skirt" />
          {roomId === 'livingRoom' && (
            <>
              <span className="rug rug-living" />
              <Sofa />
              <CoffeeTable />
              <TvUnit />
            </>
          )}
          {roomId === 'bedroom' && (
            <>
              <span className="rug rug-bedroom" />
              <Bed />
              <BedsideTable />
              <Wardrobe />
            </>
          )}
        </div>

        {roomId === 'kitchen' && <KitchenFurniture />}

        <span className="room-glowbar" />
        <span className="room-lightfloor" />

        <div className="room-appliances">
          {room.appliances.map((a) => (
            <div
              key={a.id}
              className={`appliance-slot appliance-slot--${a.id}`}
            >
              <Appliance type={a.type} name={a.name} on={current[a.id]} />
            </div>
          ))}
        </div>
      </div>
      <div className="room-vignette" />
    </div>
  )
}