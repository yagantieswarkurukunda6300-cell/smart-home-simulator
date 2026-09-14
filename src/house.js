export const ROOM_ORDER = ['livingRoom', 'bedroom', 'kitchen']

export const LIGHT_TYPES = ['light', 'lamp']

export const ROOMS = {
  livingRoom: {
    id: 'livingRoom',
    name: 'Living Room',
    short: 'Living',
    appliances: [
      { id: 'light', name: 'Ceiling Light', type: 'light' },
      { id: 'fan', name: 'Fan', type: 'fan' },
      { id: 'ac', name: 'Air Conditioner', type: 'ac' },
      { id: 'tv', name: 'Television', type: 'tv' },
    ],
  },
  bedroom: {
    id: 'bedroom',
    name: 'Bedroom',
    short: 'Bedroom',
    appliances: [
      { id: 'light', name: 'Light', type: 'light' },
      { id: 'fan', name: 'Fan', type: 'fan' },
      { id: 'ac', name: 'Air Conditioner', type: 'ac' },
      { id: 'lamp', name: 'Bedside Lamp', type: 'lamp' },
    ],
  },
  kitchen: {
    id: 'kitchen',
    name: 'Kitchen',
    short: 'Kitchen',
    appliances: [
      { id: 'light', name: 'Kitchen Light', type: 'light' },
      { id: 'exhaust', name: 'Exhaust Fan', type: 'exhaust' },
      { id: 'refrigerator', name: 'Refrigerator', type: 'refrigerator' },
    ],
  },
}

export const INITIAL_STATES = {
  livingRoom: { light: true, fan: true, ac: false, tv: true },
  bedroom: { light: false, fan: false, ac: true, lamp: true },
  kitchen: { light: true, exhaust: false, refrigerator: true },
}

export const APPLIANCE_NAMES = {
  light: 'Ceiling Light',
  fan: 'Fan',
  ac: 'Air Conditioner',
  tv: 'Television',
  lamp: 'Bedside Lamp',
  exhaust: 'Exhaust Fan',
  refrigerator: 'Refrigerator',
}