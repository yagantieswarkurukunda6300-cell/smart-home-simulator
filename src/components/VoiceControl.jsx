import { useEffect, useRef, useState } from 'react'
import { interpretCommand } from '../voice'

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <path d="M12 18v4" />
    </svg>
  )
}

export default function VoiceControl({ connected, currentRoomId, onResult }) {
  const [supported] = useState(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    return Boolean(SR)
  })
  const [listening, setListening] = useState(false)
  const [last, setLast] = useState(null)
  const recRef = useRef(null)
  const roomRef = useRef(currentRoomId)
  const onResultRef = useRef(onResult)

  useEffect(() => {
    roomRef.current = currentRoomId
  }, [currentRoomId])

  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  useEffect(() => {
    if (!supported) return undefined
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.continuous = false
    rec.maxAlternatives = 1

    rec.onstart = () => setListening(true)

    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      const result = interpretCommand(transcript, roomRef.current)
      setLast({ text: transcript, ok: result.kind !== 'unknown' })
      onResultRef.current(result)
    }

    rec.onerror = () => {
      setListening(false)
      setLast((prev) => (prev && prev.text ? prev : { text: 'Could not access microphone.', ok: false }))
    }
    rec.onend = () => setListening(false)

    recRef.current = rec

    return () => {
      try {
        rec.abort()
      } catch {
        /* noop */
      }
    }
  }, [supported])

  const activate = () => {
    if (!connected) return
    const rec = recRef.current
    if (!rec || listening) return
    try {
      setLast(null)
      rec.start()
    } catch {
      /* already running */
    }
  }

  const deactivate = () => {
    try {
      recRef.current?.stop()
    } catch {
      /* noop */
    }
    setListening(false)
  }

  return (
    <div className="voicebox">
      <div className={`micwrap ${listening ? 'listening' : ''}`}>
        <span className="ring" />
        <span className="ring r2" />
        <span className="ring r3" />
        <button
          className="micbtn"
          aria-label="Toggle voice control"
          onClick={listening ? deactivate : activate}
          disabled={!supported || !connected}
        >
          <MicIcon />
        </button>
      </div>

      {!supported ? (
        <p className="voice-status warn">Voice control is not supported in this browser.</p>
      ) : listening ? (
        <p className="voice-status listening">Listening…</p>
      ) : (
        <p className="voice-status">Tap mic &amp; say a command</p>
      )}

      {last && (
        <div className={`voice-heard ${last.ok ? 'ok' : 'bad'}`}>
          <span className="vh-icon">{last.ok ? '✓' : '!'}</span>
          &ldquo;{last.text}&rdquo;
        </div>
      )}
    </div>
  )
}