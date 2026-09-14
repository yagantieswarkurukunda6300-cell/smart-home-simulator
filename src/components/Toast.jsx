export default function Toast({ toast }) {
  const kind = toast.kind || 'info'
  return (
    <div className={`toast show ${kind}`} role="status" aria-live="polite">
      <span className="dot" />
      <span>{toast.msg}</span>
    </div>
  )
}