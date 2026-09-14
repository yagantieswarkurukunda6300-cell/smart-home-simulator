import { ROOMS, ROOM_ORDER } from '../house'
import Room from './Room'

export default function VirtualHome({ roomId, setRoom, states, connected }) {
  return (
    <section className="virtual-home">
      <header className="room-nav">
        <div className="nav-title">
          <h2>Virtual Home</h2>
          <p className={`synced ${connected ? '' : 'off'}`}>
            <span className="led" />
            {connected ? 'Synced with phone controller' : 'Controller offline — reconnect to control'}
          </p>
        </div>
        <div className="room-switch" role="tablist" aria-label="Room selector">
          {ROOM_ORDER.map((id) => (
            <button
              key={id}
              role="tab"
              aria-selected={id === roomId}
              className={id === roomId ? 'active' : ''}
              onClick={() => setRoom(id)}
            >
              {ROOMS[id].name}
            </button>
          ))}
        </div>
      </header>
      <Room key={roomId} roomId={roomId} states={states} />
    </section>
  )
}