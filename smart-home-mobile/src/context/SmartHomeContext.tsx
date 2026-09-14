import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export type DeviceCategory = 'light' | 'fan' | 'ac' | 'tv' | 'appliance';

export interface Device {
  id: string;
  name: string;
  icon: string;
  category: DeviceCategory;
  isOn: boolean;
  roomId: string;
}

export interface Room {
  id: string;
  name: string;
  icon: string;
  tint: string;
  deviceCount: number;
}

export interface BluetoothState {
  status: 'disconnected' | 'scanning' | 'connecting' | 'connected';
  deviceName: string | null;
  signal: number;
}

export interface VoiceState {
  isListening: boolean;
  status: 'idle' | 'listening' | 'processing' | 'success' | 'error';
  statusMessage: string;
  lastCommand: string | null;
  lastResult: string | null;
}

export interface NetworkState {
  status: 'disconnected' | 'connecting' | 'connected';
  host: string;
  port: string;
  error: string | null;
  deviceCount: number;
  phones: number;
}

type WireRoomId = 'livingRoom' | 'bedroom' | 'kitchen';

/** Canonical phone ⇄ laptop state shape: { roomId: { applianceId: boolean } } */
type WireState = Record<WireRoomId, Record<string, boolean>>;

const DEFAULT_PORT = '5173';

function defaultHost(): string {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) return hostUri.split(':')[0];
  return '';
}

const STORAGE_KEY = '@smart-home/network-address';

/**
 * Maps mobile device ids onto the laptop simulator's wire structure.
 * 11 devices across livingRoom (light/fan/ac/tv), bedroom (light/fan/ac/lamp)
 * and kitchen (light/exhaust/refrigerator).
 */
const DEVICE_TO_WIRE: Record<string, [WireRoomId, string]> = {
  'lr-ceiling': ['livingRoom', 'light'],
  'lr-fan': ['livingRoom', 'fan'],
  'lr-ac': ['livingRoom', 'ac'],
  'lr-tv': ['livingRoom', 'tv'],
  'br-light': ['bedroom', 'light'],
  'br-fan': ['bedroom', 'fan'],
  'br-ac': ['bedroom', 'ac'],
  'br-lamp': ['bedroom', 'lamp'],
  'k-light': ['kitchen', 'light'],
  'k-exhaust': ['kitchen', 'exhaust'],
  'k-fridge': ['kitchen', 'refrigerator'],
};

function devicesToWire(devices: Device[]): WireState {
  const wire: WireState = {
    livingRoom: { light: false, fan: false, ac: false, tv: false },
    bedroom: { light: false, fan: false, ac: false, lamp: false },
    kitchen: { light: false, exhaust: false, refrigerator: false },
  };
  for (const d of devices) {
    const target = DEVICE_TO_WIRE[d.id];
    if (target) wire[target[0]][target[1]] = d.isOn;
  }
  return wire;
}

function wireToDevices(
  devices: Device[],
  wire: Record<string, Record<string, boolean>>
): Device[] {
  return devices.map((d) => {
    const target = DEVICE_TO_WIRE[d.id];
    if (!target) return d;
    const on = wire?.[target[0]]?.[target[1]];
    if (typeof on !== 'boolean' || on === d.isOn) return d;
    return { ...d, isOn: on };
  });
}

function countWireDevices(wire: Record<string, Record<string, boolean>>): number {
  let n = 0;
  for (const room of Object.values(wire)) {
    for (const v of Object.values(room)) {
      if (typeof v === 'boolean') n += 1;
    }
  }
  return n;
}

interface SmartHomeContextValue {
  devices: Device[];
  rooms: Room[];
  bluetooth: BluetoothState;
  voice: VoiceState;
  network: NetworkState;
  toggleDevice: (id: string) => void;
  setDevice: (id: string, isOn: boolean) => void;
  turnAllLightsOn: () => void;
  turnAllLightsOff: () => void;
  turnOffAllDevices: () => void;
  getRoomDevices: (roomId: string) => Device[];
  getStats: () => { total: number; on: number; off: number; lightsOn: number };
  getRoomStats: (roomId: string) => { total: number; on: number };
  connect: () => void;
  disconnect: () => void;
  resetBluetooth: () => void;
  networkConnect: (host?: string, port?: string) => void;
  networkDisconnect: () => void;
  setServerAddress: (host: string, port: string) => void;
  startListening: () => void;
  stopListening: () => void;
  executeCommand: (command: string) => void;
}

const ROOMS: Room[] = [
  { id: 'living-room', name: 'Living Room', icon: 'sofa', tint: '#00D4FF', deviceCount: 4 },
  { id: 'bedroom', name: 'Bedroom', icon: 'bed-king', tint: '#7B61FF', deviceCount: 4 },
  { id: 'kitchen', name: 'Kitchen', icon: 'silverware-fork-knife', tint: '#00E676', deviceCount: 3 },
];

const INITIAL_DEVICES: Device[] = [
  { id: 'lr-ceiling', name: 'Ceiling Light', icon: 'ceiling-light', category: 'light', isOn: false, roomId: 'living-room' },
  { id: 'lr-fan', name: 'Fan', icon: 'fan', category: 'fan', isOn: false, roomId: 'living-room' },
  { id: 'lr-ac', name: 'Air Conditioner', icon: 'air-conditioner', category: 'ac', isOn: false, roomId: 'living-room' },
  { id: 'lr-tv', name: 'Smart TV', icon: 'television-speaker', category: 'tv', isOn: false, roomId: 'living-room' },

  { id: 'br-light', name: 'Ceiling Light', icon: 'lightbulb-on', category: 'light', isOn: false, roomId: 'bedroom' },
  { id: 'br-fan', name: 'Ceiling Fan', icon: 'fan', category: 'fan', isOn: false, roomId: 'bedroom' },
  { id: 'br-ac', name: 'Air Conditioner', icon: 'air-conditioner', category: 'ac', isOn: false, roomId: 'bedroom' },
  { id: 'br-lamp', name: 'Bedside Lamp', icon: 'desk-lamp', category: 'light', isOn: false, roomId: 'bedroom' },

  { id: 'k-light', name: 'Ceiling Light', icon: 'ceiling-light', category: 'light', isOn: false, roomId: 'kitchen' },
  { id: 'k-exhaust', name: 'Range Hood', icon: 'stove', category: 'fan', isOn: false, roomId: 'kitchen' },
  { id: 'k-fridge', name: 'Refrigerator', icon: 'fridge-outline', category: 'appliance', isOn: false, roomId: 'kitchen' },
];

const BLUETOOTH_DEVICE = 'Smart Home Hub';

const SmartHomeContext = createContext<SmartHomeContextValue | null>(null);

export function SmartHomeProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [bluetooth, setBluetooth] = useState<BluetoothState>({
    status: 'disconnected',
    deviceName: null,
    signal: 0,
  });
  const [voice, setVoice] = useState<VoiceState>({
    isListening: false,
    status: 'idle',
    statusMessage: 'Tap the mic and speak a command',
    lastCommand: null,
    lastResult: null,
  });
  const [network, setNetwork] = useState<NetworkState>({
    status: 'disconnected',
    host: defaultHost(),
    port: DEFAULT_PORT,
    error: null,
    deviceCount: 0,
    phones: 0,
  });

  const connectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voiceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldStayConnectedRef = useRef(false);
  const attemptsRef = useRef(0);
  const lastSentRef = useRef<string | null>(null);
  const hostRef = useRef(network.host);
  const portRef = useRef(network.port);
  const didInitRef = useRef(false);
  const connectAttemptRef = useRef<(host: string, port: string) => void>(() => {});

  const toggleDevice = useCallback((id: string) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, isOn: !d.isOn } : d)));
  }, []);

  const setDevice = useCallback((id: string, isOn: boolean) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, isOn } : d)));
  }, []);

  const setAllLights = useCallback((isOn: boolean) => {
    setDevices((prev) => prev.map((d) => (d.category === 'light' ? { ...d, isOn } : d)));
  }, []);

  const turnAllLightsOn = useCallback(() => setAllLights(true), [setAllLights]);
  const turnAllLightsOff = useCallback(() => setAllLights(false), [setAllLights]);

  const turnOffAllDevices = useCallback(() => {
    setDevices((prev) => prev.map((d) => ({ ...d, isOn: false })));
  }, []);

  const getRoomDevices = useCallback(
    (roomId: string) => devices.filter((d) => d.roomId === roomId),
    [devices]
  );

  const getStats = useCallback(() => {
    const on = devices.filter((d) => d.isOn).length;
    return {
      total: devices.length,
      on,
      off: devices.length - on,
      lightsOn: devices.filter((d) => d.category === 'light' && d.isOn).length,
    };
  }, [devices]);

  const getRoomStats = useCallback(
    (roomId: string) => {
      const inRoom = devices.filter((d) => d.roomId === roomId);
      return { total: inRoom.length, on: inRoom.filter((d) => d.isOn).length };
    },
    [devices]
  );

  const resetBluetooth = useCallback(() => {
    if (connectTimer.current) {
      clearTimeout(connectTimer.current);
      connectTimer.current = null;
    }
    setBluetooth({ status: 'disconnected', deviceName: null, signal: 0 });
  }, []);

  const connect = useCallback(() => {
    if (connectTimer.current) clearTimeout(connectTimer.current);
    setBluetooth({ status: 'scanning', deviceName: null, signal: 0 });
    connectTimer.current = setTimeout(() => {
      setBluetooth((prev) => ({ ...prev, status: 'connecting' }));
      connectTimer.current = setTimeout(() => {
        setBluetooth({
          status: 'connected',
          deviceName: BLUETOOTH_DEVICE,
          signal: 92,
        });
      }, 1100);
    }, 1600);
  }, []);

  const disconnect = useCallback(() => {
    if (connectTimer.current) clearTimeout(connectTimer.current);
    setBluetooth({ status: 'disconnected', deviceName: null, signal: 0 });
  }, []);

  const applyWireState = useCallback((wire: Record<string, Record<string, boolean>>) => {
    const key = JSON.stringify(wire);
    lastSentRef.current = key;
    setDevices((prev) => wireToDevices(prev, wire as WireState));
    setNetwork((prev) => ({ ...prev, deviceCount: countWireDevices(wire) }));
  }, []);

  const connectAttempt = useCallback(
    (host: string, port: string) => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      const prev = wsRef.current;
      if (prev) {
        try {
          prev.onopen = null;
          prev.onmessage = null;
          prev.onerror = null;
          prev.onclose = null;
          prev.close();
        } catch {
          /* already closed */
        }
        wsRef.current = null;
      }

      const url = `ws://${host}:${port}/ws`;
      let ws: WebSocket | null = null;
      try {
        ws = new WebSocket(url);
      } catch {
        setNetwork((p) => ({ ...p, error: 'Invalid server address' }));
        return;
      }
      wsRef.current = ws;

      ws.onopen = () => {
        if (wsRef.current !== ws) return;
        attemptsRef.current = 0;
        setNetwork((p) => ({ ...p, status: 'connected', error: null }));
        ws.send(JSON.stringify({ type: 'hello', role: 'phone' }));
      };

      ws.onmessage = (event) => {
        if (wsRef.current !== ws) return;
        let msg: { type?: string; state?: WireState; phones?: number };
        try {
          msg = JSON.parse(String(event.data));
        } catch {
          return;
        }
        if (!msg || typeof msg !== 'object') return;

        if (msg.type === 'welcome') {
          setNetwork((p) => ({ ...p, status: 'connected', error: null }));
          if (msg.state) applyWireState(msg.state);
          const phones = msg.phones;
          if (typeof phones === 'number') {
            setNetwork((p) => ({ ...p, phones }));
          }
          return;
        }

        if (msg.type === 'state') {
          if (msg.state) applyWireState(msg.state);
          return;
        }

        if (msg.type === 'peers') {
          const phones = msg.phones;
          if (typeof phones === 'number') {
            setNetwork((p) => ({ ...p, phones }));
          }
        }
      };

      ws.onerror = () => {
        // onclose always follows and drives the retry loop
      };

      ws.onclose = () => {
        if (wsRef.current !== ws) return;
        wsRef.current = null;
        if (!shouldStayConnectedRef.current) {
          setNetwork((p) => ({ ...p, status: 'disconnected' }));
          return;
        }
        const delay = Math.min(15000, 1000 * 2 ** Math.min(attemptsRef.current, 4));
        attemptsRef.current += 1;
        setNetwork((p) => ({ ...p, status: 'connecting', error: 'Hub unreachable — retrying…' }));
        reconnectTimer.current = setTimeout(() => {
          reconnectTimer.current = null;
          connectAttemptRef.current(hostRef.current, portRef.current);
        }, delay);
      };
    },
    [applyWireState]
  );

  useEffect(() => {
    connectAttemptRef.current = connectAttempt;
  }, [connectAttempt]);

  const setServerAddress = useCallback((host: string, port: string) => {
    const h = host.trim();
    const p = port.trim() || DEFAULT_PORT;
    hostRef.current = h;
    portRef.current = p;
    setNetwork((prev) => ({ ...prev, host: h, port: p }));
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ host: h, port: p })).catch(() => {});
  }, []);

  const networkConnect = useCallback(
    (host?: string, port?: string) => {
      const h = host && host.trim() ? host.trim() : hostRef.current;
      const rawPort = port && port.trim() ? port.trim() : portRef.current;
      const p = /^\d+$/.test(rawPort) ? rawPort : DEFAULT_PORT;
      hostRef.current = h;
      portRef.current = p;
      setServerAddress(h, p);
      shouldStayConnectedRef.current = true;
      attemptsRef.current = 0;
      setNetwork((prev) => ({ ...prev, host: h, port: p, status: 'connecting', error: null }));
      connectAttemptRef.current(h, p);
    },
    [setServerAddress]
  );

  const networkDisconnect = useCallback(() => {
    shouldStayConnectedRef.current = false;
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    const ws = wsRef.current;
    wsRef.current = null;
    if (ws) {
      try {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        ws.close();
      } catch {
        /* already closed */
      }
    }
    setNetwork((prev) => ({
      ...prev,
      status: 'disconnected',
      error: null,
      phones: 0,
      deviceCount: 0,
    }));
  }, []);

  // Publish local device changes; the latest received state is already cached in lastSentRef.
  useEffect(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== 1) return;
    const wire = devicesToWire(devices);
    const key = JSON.stringify(wire);
    if (lastSentRef.current === key) return;
    lastSentRef.current = key;
    ws.send(JSON.stringify({ type: 'sync', state: wire }));
  }, [devices]);

  // Restore the last-used server address and reconnect automatically.
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) return;
        try {
          const saved = JSON.parse(raw) as { host?: string; port?: string };
          const h = typeof saved?.host === 'string' ? saved.host.trim() : '';
          const p = typeof saved?.port === 'string' ? saved.port.trim() : DEFAULT_PORT;
          if (!h) return;
          hostRef.current = h;
          portRef.current = p;
          shouldStayConnectedRef.current = true;
          attemptsRef.current = 0;
          setNetwork((prev) => ({ ...prev, host: h, port: p, status: 'connecting' }));
          connectAttemptRef.current(h, p);
        } catch {
          /* corrupt saved address */
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Close the socket on unmount.
  useEffect(() => {
    return () => {
      shouldStayConnectedRef.current = false;
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      const ws = wsRef.current;
      wsRef.current = null;
      if (ws) {
        try {
          ws.onopen = null;
          ws.onmessage = null;
          ws.onerror = null;
          ws.onclose = null;
          ws.close();
        } catch {
          /* already closed */
        }
      }
    };
  }, []);

  const findDeviceTarget = useCallback(
    (query: string): Device[] => {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      // Match room-level commands first: "<room> light(s)"
      const room = ROOMS.find(
        (r) => r.name.toLowerCase() === q || q.startsWith(r.name.toLowerCase() + ' ')
      );
      if (room) {
        const rest = room ? q.slice(room.name.length).trim() : '';
        if (rest.includes('light')) {
          return devices.filter((d) => d.roomId === room.id && d.category === 'light');
        }
        if (rest.includes('ac') || rest.includes('air condition')) {
          return devices.filter((d) => d.roomId === room.id && d.category === 'ac');
        }
        return devices.filter((d) => d.roomId === room.id);
      }
      // Otherwise match device names anywhere.
      const matches = devices.filter((d) => {
        const name = d.name.toLowerCase().replace(/^(ceiling|smart|bedside|range)\s*/, '');
        return name.includes(q) || d.name.toLowerCase().includes(q);
      });
      if (matches.length > 0) return matches;
      // Fall back to category-level matching.
      if (q === 'fan' || q.includes('fan')) return devices.filter((d) => d.category === 'fan');
      if (q.includes('light')) return devices.filter((d) => d.category === 'light');
      if (q.includes('ac') || q.includes('air condition')) return devices.filter((d) => d.category === 'ac');
      return [];
    },
    [devices]
  );

  const executeCommand = useCallback(
    (command: string) => {
      const lower = command.toLowerCase();
      let result: string;

      if (lower.includes('all lights off') || lower === 'lights off' || lower === 'turn off lights') {
        setAllLights(false);
        result = 'Turned off all lights';
      } else if (lower.includes('all lights on') || lower === 'lights on' || lower === 'turn on lights') {
        setAllLights(true);
        result = 'Turned on all lights';
      } else if (lower.includes('all devices off') || lower.includes('everything off')) {
        turnOffAllDevices();
        result = 'Turned off all devices';
      } else if (lower.includes('turn on') || lower.includes('switch on')) {
        const targets = findDeviceTarget(lower.replace('turn on', '').replace('switch on', ''));
        if (targets.length === 0) {
          result = `Could not find device for "${command}"`;
        } else {
          setDevices((prev) =>
            prev.map((d) => (targets.some((t) => t.id === d.id) ? { ...d, isOn: true } : d))
          );
          result = `Turned on ${targets.map((t) => t.name).join(', ')}`;
        }
      } else if (lower.includes('turn off') || lower.includes('switch off')) {
        const targets = findDeviceTarget(lower.replace('turn off', '').replace('switch off', ''));
        if (targets.length === 0) {
          result = `Could not find device for "${command}"`;
        } else {
          setDevices((prev) =>
            prev.map((d) => (targets.some((t) => t.id === d.id) ? { ...d, isOn: false } : d))
          );
          result = `Turned off ${targets.map((t) => t.name).join(', ')}`;
        }
      } else {
        result = `Unrecognized command: "${command}"`;
      }

      setVoice((prev) => ({
        ...prev,
        status: 'success',
        statusMessage: result,
        lastResult: result,
        lastCommand: command,
      }));
    },
    [findDeviceTarget, setAllLights, turnOffAllDevices]
  );

  const startListening = useCallback(() => {
    if (voiceTimer.current) clearTimeout(voiceTimer.current);
    setVoice((prev) => ({
      ...prev,
      isListening: true,
      status: 'listening',
      statusMessage: 'Listening...',
    }));

    voiceTimer.current = setTimeout(() => {
      setVoice((prev) => ({
        ...prev,
        isListening: false,
        status: 'processing',
        statusMessage: 'Processing command...',
      }));

      voiceTimer.current = setTimeout(() => {
        const options = [
          'Turn on living room light',
          'Turn off bedroom fan',
          'Turn on all lights',
          'Turn off kitchen exhaust',
          'Turn on the air conditioner',
          'Turn off the television',
          'Lights off',
        ];
        const command = options[Math.floor(Math.random() * options.length)];
        setVoice((prev) => ({
          ...prev,
          lastCommand: command,
        }));
        executeCommand(command);
      }, 1300);
    }, 2400);
  }, [executeCommand]);

  const stopListening = useCallback(() => {
    if (voiceTimer.current) clearTimeout(voiceTimer.current);
    setVoice((prev) => ({
      ...prev,
      isListening: false,
      status: prev.lastCommand ? 'success' : 'idle',
      statusMessage: prev.lastCommand ? prev.statusMessage : 'Voice input cancelled',
    }));
  }, []);

  const value = useMemo<SmartHomeContextValue>(
    () => ({
      devices,
      rooms: ROOMS,
      bluetooth,
      voice,
      network,
      toggleDevice,
      setDevice,
      turnAllLightsOn,
      turnAllLightsOff,
      turnOffAllDevices,
      getRoomDevices,
      getStats,
      getRoomStats,
      connect,
      disconnect,
      resetBluetooth,
      networkConnect,
      networkDisconnect,
      setServerAddress,
      startListening,
      stopListening,
      executeCommand,
    }),
    [
      devices,
      bluetooth,
      voice,
      network,
      toggleDevice,
      setDevice,
      turnAllLightsOn,
      turnAllLightsOff,
      turnOffAllDevices,
      getRoomDevices,
      getStats,
      getRoomStats,
      connect,
      disconnect,
      resetBluetooth,
      networkConnect,
      networkDisconnect,
      setServerAddress,
      startListening,
      stopListening,
      executeCommand,
    ]
  );

  return <SmartHomeContext.Provider value={value}>{children}</SmartHomeContext.Provider>;
}

export function useSmartHome(): SmartHomeContextValue {
  const ctx = useContext(SmartHomeContext);
  if (!ctx) throw new Error('useSmartHome must be used within SmartHomeProvider');
  return ctx;
}