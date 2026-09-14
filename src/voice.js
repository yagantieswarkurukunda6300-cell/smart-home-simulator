import { ROOMS } from './house'

const ROOM_PATTERNS = [
  [/living|hall|lounge|sitting room|main room|drawing room/i, 'livingRoom'],
  [/bed room|bedroom|bed/i, 'bedroom'],
  [/kitchen|cooking|dining/i, 'kitchen'],
]

function detectRoom(text) {
  for (const [re, id] of ROOM_PATTERNS) if (re.test(text)) return id
  return null
}

const ALIASES = {
  light: ['light'],
  lamp: ['lamp', 'bedside', 'night light'],
  fan: ['fan'],
  ac: ['air condition', 'aircon', 'ac', 'conditioner', 'cooler'],
  tv: ['tv', 'television'],
  exhaust: ['exhaust', 'chimney', 'hood'],
  refrigerator: ['refrigerator', 'fridge'],
}

function collectApplianceIds(text, roomIds) {
  const found = []
  for (const roomId of roomIds) {
    for (const app of ROOMS[roomId].appliances) {
      const keys = ALIASES[app.type] || []
      const hit = keys.some((key) =>
        new RegExp(`\\b${key.replace(/\s+/g, '\\s+')}\\b`, 'i').test(text),
      )
      if (hit && !found.includes(app.id)) found.push(app.id)
    }
  }
  return found
}

function detectOnOff(text) {
  const on =
    /\b(turn on|switch on|power on|put on|start|activate|enable)\b/i.test(text) ||
    /\bon\b/i.test(text)
  const off =
    /\b(turn off|switch off|power off|shut ?off|deactivate|disable|stop|kill)\b/i.test(text) ||
    /\boff\b/i.test(text)
  if (on && !off) return true
  if (off && !on) return false
  return null
}

function hasAllLightsPhrase(text, value) {
  const word = value ? 'on' : 'off'
  return new RegExp(
    `\\b(all|every) (the )?lights? ${word}|${word} (all|every) (the )?lights?`,
    'i',
  ).test(text)
}

function hasLightsNoRoom(text, value) {
  const word = value ? 'on' : 'off'
  return new RegExp(`\\b(lights ${word}|${word} (the )?lights)\\b`, 'i').test(text)
}

export function interpretCommand(raw, currentRoomId = 'livingRoom') {
  const text = raw
    .toLowerCase()
    .replace(/[.,!?'"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const roomId = detectRoom(text)

  const everythingOff =
    /\b(everything off|off everything|all (devices|appliances) off|all off|turn everything off)\b/.test(
      text,
    )
  if (everythingOff) return { kind: 'allDevices', value: false }

  if (hasAllLightsPhrase(text, false) || (roomId === null && hasLightsNoRoom(text, false))) {
    return { kind: 'allLights', value: false }
  }
  if (hasAllLightsPhrase(text, true) || (roomId === null && hasLightsNoRoom(text, true))) {
    return { kind: 'allLights', value: true }
  }

  const value = detectOnOff(text)

  if (/connect|pair|link (the )?controller|link (the )?phone/.test(text)) {
    if (/disconnect|unpair/.test(text)) return { kind: 'disconnect' }
    return { kind: 'connect' }
  }

  if (value === null) {
    return {
      kind: 'unknown',
      note: applianceMatches(text, roomId, currentRoomId).length
        ? 'Please say "turn on" or "turn off".'
        : 'I could not recognize a command. Try "turn on the living room light".',
    }
  }

  const applianceIds = applianceMatches(text, roomId, currentRoomId)
  if (applianceIds.length === 0) {
    return { kind: 'unknown', note: 'I could not find that appliance in this room.' }
  }

  return {
    kind: 'toggle',
    roomId: roomId || currentRoomId,
    applianceIds,
    value,
    setRoom: Boolean(roomId),
  }
}

function applianceMatches(text, roomId, currentRoomId) {
  const targetRooms = roomId ? [roomId] : [currentRoomId]
  return collectApplianceIds(text, targetRooms)
}