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

type WireState = Record<WireRoomId, Record<string, boolean>>;

const DEFAULT_PORT = '5173';

function defaultHost(): string {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) return hostUri.split(':')[0];
  return '';
}

const STORAGE_KEY = '@smart-home/network-address';

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
    livingRoom: {
      light: false,
      fan: false,
      ac: false,
      tv: false,
    },
    bedroom: {
      light: false,
      fan: false,
      ac: false,
      lamp: false,
    },
    kitchen: {
      light: false,
      exhaust: false,
      refrigerator: false,
    },
  };

  for (const device of devices) {
    const target = DEVICE_TO_WIRE[device.id];

    if (target) {
      wire[target[0]][target[1]] = device.isOn;
    }
  }

  return wire;
}

function wireToDevices(
  devices: Device[],
  wire: Record<string, Record<string, boolean>>
): Device[] {
  return devices.map((device) => {
    const target = DEVICE_TO_WIRE[device.id];

    if (!target) {
      return device;
    }

    const remoteValue = wire?.[target[0]]?.[target[1]];

    if (
      typeof remoteValue !== 'boolean' ||
      remoteValue === device.isOn
    ) {
      return device;
    }

    return {
      ...device,
      isOn: remoteValue,
    };
  });
}

function countWireDevices(
  wire: Record<string, Record<string, boolean>>
): number {
  let count = 0;

  for (const room of Object.values(wire)) {
    for (const value of Object.values(room)) {
      if (typeof value === 'boolean') {
        count += 1;
      }
    }
  }

  return count;
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
  getStats: () => {
    total: number;
    on: number;
    off: number;
    lightsOn: number;
  };

  getRoomStats: (roomId: string) => {
    total: number;
    on: number;
  };

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
  {
    id: 'living-room',
    name: 'Living Room',
    icon: 'sofa',
    tint: '#00D4FF',
    deviceCount: 4,
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    icon: 'bed-king',
    tint: '#7B61FF',
    deviceCount: 4,
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: 'silverware-fork-knife',
    tint: '#00E676',
    deviceCount: 3,
  },
];

const INITIAL_DEVICES: Device[] = [
  {
    id: 'lr-ceiling',
    name: 'Ceiling Light',
    icon: 'ceiling-light',
    category: 'light',
    isOn: false,
    roomId: 'living-room',
  },
  {
    id: 'lr-fan',
    name: 'Fan',
    icon: 'fan',
    category: 'fan',
    isOn: false,
    roomId: 'living-room',
  },
  {
    id: 'lr-ac',
    name: 'Air Conditioner',
    icon: 'air-conditioner',
    category: 'ac',
    isOn: false,
    roomId: 'living-room',
  },
  {
    id: 'lr-tv',
    name: 'Smart TV',
    icon: 'television-speaker',
    category: 'tv',
    isOn: false,
    roomId: 'living-room',
  },

  {
    id: 'br-light',
    name: 'Ceiling Light',
    icon: 'lightbulb-on',
    category: 'light',
    isOn: false,
    roomId: 'bedroom',
  },
  {
    id: 'br-fan',
    name: 'Ceiling Fan',
    icon: 'fan',
    category: 'fan',
    isOn: false,
    roomId: 'bedroom',
  },
  {
    id: 'br-ac',
    name: 'Air Conditioner',
    icon: 'air-conditioner',
    category: 'ac',
    isOn: false,
    roomId: 'bedroom',
  },
  {
    id: 'br-lamp',
    name: 'Bedside Lamp',
    icon: 'desk-lamp',
    category: 'light',
    isOn: false,
    roomId: 'bedroom',
  },

  {
    id: 'k-light',
    name: 'Ceiling Light',
    icon: 'ceiling-light',
    category: 'light',
    isOn: false,
    roomId: 'kitchen',
  },
  {
    id: 'k-exhaust',
    name: 'Range Hood',
    icon: 'stove',
    category: 'fan',
    isOn: false,
    roomId: 'kitchen',
  },
  {
    id: 'k-fridge',
    name: 'Refrigerator',
    icon: 'fridge-outline',
    category: 'appliance',
    isOn: false,
    roomId: 'kitchen',
  },
];

const BLUETOOTH_DEVICE = 'Smart Home Hub';

const SmartHomeContext =
  createContext<SmartHomeContextValue | null>(null);

export function SmartHomeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [devices, setDevices] =
    useState<Device[]>(INITIAL_DEVICES);

  const [bluetooth, setBluetooth] =
    useState<BluetoothState>({
      status: 'disconnected',
      deviceName: null,
      signal: 0,
    });

  const [voice, setVoice] =
    useState<VoiceState>({
      isListening: false,
      status: 'idle',
      statusMessage: 'Tap the mic and speak a command',
      lastCommand: null,
      lastResult: null,
    });

  const [network, setNetwork] =
    useState<NetworkState>({
      status: 'disconnected',
      host: defaultHost(),
      port: DEFAULT_PORT,
      error: null,
      deviceCount: 0,
      phones: 0,
    });

  const connectTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const voiceTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const wsRef =
    useRef<WebSocket | null>(null);

  const reconnectTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const shouldStayConnectedRef =
    useRef(false);

  const attemptsRef =
    useRef(0);

  /*
   * Last state actually SENT by this phone.
   * Remote states are NOT treated as local sends.
   */
  const lastSentRef =
    useRef<string | null>(null);

  /*
   * Local state waiting for a WebSocket connection.
   */
  const pendingWireRef =
    useRef<WireState | null>(null);

  /*
   * Always-current device state for WebSocket callbacks.
   */
  const devicesRef =
    useRef<Device[]>(INITIAL_DEVICES);

  /*
   * Prevent connection-state race conditions.
   */
  const wsConnectedRef =
    useRef(false);

  const hostRef =
    useRef(network.host);

  const portRef =
    useRef(network.port);

  const didInitRef =
    useRef(false);

  const connectAttemptRef =
    useRef<(host: string, port: string) => void>(
      () => {}
    );

  devicesRef.current = devices;

  const toggleDevice = useCallback((id: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id
          ? {
              ...device,
              isOn: !device.isOn,
            }
          : device
      )
    );
  }, []);

  const setDevice = useCallback(
    (id: string, isOn: boolean) => {
      setDevices((prev) =>
        prev.map((device) =>
          device.id === id
            ? {
                ...device,
                isOn,
              }
            : device
        )
      );
    },
    []
  );

  const setAllLights = useCallback(
    (isOn: boolean) => {
      setDevices((prev) =>
        prev.map((device) =>
          device.category === 'light'
            ? {
                ...device,
                isOn,
              }
            : device
        )
      );
    },
    []
  );

  const turnAllLightsOn = useCallback(
    () => setAllLights(true),
    [setAllLights]
  );

  const turnAllLightsOff = useCallback(
    () => setAllLights(false),
    [setAllLights]
  );

  const turnOffAllDevices = useCallback(() => {
    setDevices((prev) =>
      prev.map((device) => ({
        ...device,
        isOn: false,
      }))
    );
  }, []);

  const getRoomDevices = useCallback(
    (roomId: string) =>
      devices.filter(
        (device) => device.roomId === roomId
      ),
    [devices]
  );

  const getStats = useCallback(() => {
    const on = devices.filter(
      (device) => device.isOn
    ).length;

    return {
      total: devices.length,
      on,
      off: devices.length - on,
      lightsOn: devices.filter(
        (device) =>
          device.category === 'light' &&
          device.isOn
      ).length,
    };
  }, [devices]);

  const getRoomStats = useCallback(
    (roomId: string) => {
      const inRoom = devices.filter(
        (device) => device.roomId === roomId
      );

      return {
        total: inRoom.length,
        on: inRoom.filter(
          (device) => device.isOn
        ).length,
      };
    },
    [devices]
  );

  const resetBluetooth = useCallback(() => {
    if (connectTimer.current) {
      clearTimeout(connectTimer.current);
      connectTimer.current = null;
    }

    setBluetooth({
      status: 'disconnected',
      deviceName: null,
      signal: 0,
    });
  }, []);

  const connect = useCallback(() => {
    if (connectTimer.current) {
      clearTimeout(connectTimer.current);
    }

    setBluetooth({
      status: 'scanning',
      deviceName: null,
      signal: 0,
    });

    connectTimer.current = setTimeout(() => {
      setBluetooth((prev) => ({
        ...prev,
        status: 'connecting',
      }));

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
    if (connectTimer.current) {
      clearTimeout(connectTimer.current);
    }

    setBluetooth({
      status: 'disconnected',
      deviceName: null,
      signal: 0,
    });
  }, []);

  /*
   * Apply state received from laptop/server.
   *
   * IMPORTANT:
   * This updates the phone UI but does NOT queue
   * the received state as a new local state.
   */
  const applyWireState = useCallback(
    (
      wire: Record<
        string,
        Record<string, boolean>
      >
    ) => {
      const key = JSON.stringify(wire);

      setDevices((prev) =>
        wireToDevices(prev, wire as WireState)
      );

      setNetwork((prev) => ({
        ...prev,
        deviceCount: countWireDevices(wire),
      }));

      /*
       * Remember this state so the devices effect
       * doesn't immediately echo it back.
       */
      lastSentRef.current = key;
      pendingWireRef.current = null;
    },
    []
  );

  const connectAttempt = useCallback(
    (host: string, port: string) => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }

      /*
       * Close previous socket safely.
       */
      const previous = wsRef.current;

      if (previous) {
        try {
          previous.onopen = null;
          previous.onmessage = null;
          previous.onerror = null;
          previous.onclose = null;
          previous.close();
        } catch {
          // Already closed.
        }

        wsRef.current = null;
      }

      wsConnectedRef.current = false;

      const url = `ws://${host}:${port}/ws`;

      let ws: WebSocket;

      try {
        ws = new WebSocket(url);
      } catch {
        setNetwork((prev) => ({
          ...prev,
          status: 'connecting',
          error: 'Invalid server address',
        }));

        return;
      }

      wsRef.current = ws;

      /*
       * SOCKET OPEN
       */
      ws.onopen = () => {
        if (wsRef.current !== ws) {
          return;
        }

        wsConnectedRef.current = true;
        attemptsRef.current = 0;

        setNetwork((prev) => ({
          ...prev,
          status: 'connected',
          error: null,
        }));

        /*
         * Identify this client as PHONE.
         */
        ws.send(
          JSON.stringify({
            type: 'hello',
            role: 'phone',
          })
        );

        /*
         * If the user changed something while the
         * socket was connecting, send that exact
         * pending state now.
         *
         * Otherwise send the current phone state.
         */
        const wire =
          pendingWireRef.current ??
          devicesToWire(devicesRef.current);

        const key = JSON.stringify(wire);

        if (lastSentRef.current !== key) {
          ws.send(
            JSON.stringify({
              type: 'sync',
              state: wire,
            })
          );

          lastSentRef.current = key;
          pendingWireRef.current = null;
        }
      };

      /*
       * SERVER MESSAGE
       */
      ws.onmessage = (event) => {
        if (wsRef.current !== ws) {
          return;
        }

        let msg: {
          type?: string;
          state?: WireState;
          phones?: number;
          phoneDirty?: boolean;
        };

        try {
          msg = JSON.parse(
            String(event.data)
          );
        } catch {
          return;
        }

        if (!msg || typeof msg !== 'object') {
          return;
        }

        /*
         * SERVER WELCOME
         */
        if (msg.type === 'welcome') {
          setNetwork((prev) => ({
            ...prev,
            status: 'connected',
            error: null,
          }));

          if (msg.state) {
            applyWireState(msg.state);
          }

          if (typeof msg.phones === 'number') {
            setNetwork((prev) => ({
              ...prev,
              phones: msg.phones!,
            }));
          }

          return;
        }

        /*
         * REMOTE STATE
         *
         * This is the important phone <-> laptop
         * synchronization path.
         */
        if (msg.type === 'state') {
          if (msg.state) {
            applyWireState(msg.state);
          }

          return;
        }

        /*
         * PEER COUNT
         */
        if (msg.type === 'peers') {
          if (typeof msg.phones === 'number') {
            setNetwork((prev) => ({
              ...prev,
              phones: msg.phones!,
            }));
          }

          return;
        }
      };

      /*
       * ERROR
       *
       * onclose handles reconnect.
       */
      ws.onerror = () => {
        // Reconnect is handled by onclose.
      };

      /*
       * SOCKET CLOSED
       */
      ws.onclose = () => {
        if (wsRef.current !== ws) {
          return;
        }

        wsConnectedRef.current = false;
        wsRef.current = null;

        if (!shouldStayConnectedRef.current) {
          setNetwork((prev) => ({
            ...prev,
            status: 'disconnected',
          }));

          return;
        }

        const delay = Math.min(
          15000,
          1000 *
            2 **
              Math.min(
                attemptsRef.current,
                4
              )
        );

        attemptsRef.current += 1;

        setNetwork((prev) => ({
          ...prev,
          status: 'connecting',
          error:
            'Hub unreachable — retrying…',
        }));

        reconnectTimer.current =
          setTimeout(() => {
            reconnectTimer.current = null;

            connectAttemptRef.current(
              hostRef.current,
              portRef.current
            );
          }, delay);
      };
    },
    [applyWireState]
  );

  useEffect(() => {
    connectAttemptRef.current =
      connectAttempt;
  }, [connectAttempt]);

  /*
   * Save laptop address.
   */
  const setServerAddress = useCallback(
    (host: string, port: string) => {
      const h = host.trim();
      const p =
        port.trim() || DEFAULT_PORT;

      hostRef.current = h;
      portRef.current = p;

      setNetwork((prev) => ({
        ...prev,
        host: h,
        port: p,
      }));

      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          host: h,
          port: p,
        })
      ).catch(() => {});
    },
    []
  );

  /*
   * MANUAL CONNECT
   */
  const networkConnect = useCallback(
    (host?: string, port?: string) => {
      const h =
        host && host.trim()
          ? host.trim()
          : hostRef.current;

      const rawPort =
        port && port.trim()
          ? port.trim()
          : portRef.current;

      const p =
        /^\d+$/.test(rawPort)
          ? rawPort
          : DEFAULT_PORT;

      hostRef.current = h;
      portRef.current = p;

      setServerAddress(h, p);

      shouldStayConnectedRef.current = true;
      attemptsRef.current = 0;

      setNetwork((prev) => ({
        ...prev,
        host: h,
        port: p,
        status: 'connecting',
        error: null,
      }));

      connectAttemptRef.current(h, p);
    },
    [setServerAddress]
  );

  /*
   * DISCONNECT
   */
  const networkDisconnect = useCallback(() => {
    shouldStayConnectedRef.current = false;

    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }

    const ws = wsRef.current;

    wsRef.current = null;
    wsConnectedRef.current = false;

    if (ws) {
      try {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        ws.close();
      } catch {
        // Already closed.
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

  /*
   * LOCAL DEVICE -> LAPTOP
   *
   * Every local device change is converted to the
   * canonical wire format.
   *
   * If WebSocket is not OPEN, the state remains queued
   * in pendingWireRef and is sent from onopen.
   */
  useEffect(() => {
    const wire = devicesToWire(devices);
    const key = JSON.stringify(wire);

    pendingWireRef.current = wire;

    const ws = wsRef.current;

    if (
      !ws ||
      ws.readyState !== WebSocket.OPEN ||
      !wsConnectedRef.current
    ) {
      return;
    }

    /*
     * Don't echo a state we already sent or received.
     */
    if (lastSentRef.current === key) {
      pendingWireRef.current = null;
      return;
    }

    try {
      ws.send(
        JSON.stringify({
          type: 'sync',
          state: wire,
        })
      );

      lastSentRef.current = key;
      pendingWireRef.current = null;
    } catch {
      /*
       * Keep pendingWireRef so reconnect/onopen
       * can send the latest state.
       */
      pendingWireRef.current = wire;
    }
  }, [devices]);

  /*
   * RESTORE SAVED SERVER ADDRESS
   */
  useEffect(() => {
    if (didInitRef.current) {
      return;
    }

    didInitRef.current = true;

    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) {
          return;
        }

        try {
          const saved = JSON.parse(raw) as {
            host?: string;
            port?: string;
          };

          const h =
            typeof saved?.host === 'string'
              ? saved.host.trim()
              : '';

          const p =
            typeof saved?.port === 'string'
              ? saved.port.trim()
              : DEFAULT_PORT;

          if (!h) {
            return;
          }

          hostRef.current = h;
          portRef.current = p;

          shouldStayConnectedRef.current =
            true;

          attemptsRef.current = 0;

          setNetwork((prev) => ({
            ...prev,
            host: h,
            port: p,
            status: 'connecting',
          }));

          connectAttemptRef.current(h, p);
        } catch {
          // Corrupt saved address.
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * CLEANUP
   */
  useEffect(() => {
    return () => {
      shouldStayConnectedRef.current =
        false;

      wsConnectedRef.current = false;

      if (reconnectTimer.current) {
        clearTimeout(
          reconnectTimer.current
        );

        reconnectTimer.current = null;
      }

      if (connectTimer.current) {
        clearTimeout(
          connectTimer.current
        );

        connectTimer.current = null;
      }

      if (voiceTimer.current) {
        clearTimeout(
          voiceTimer.current
        );

        voiceTimer.current = null;
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
          // Already closed.
        }
      }
    };
  }, []);

  /*
   * FIND DEVICE FOR VOICE COMMAND
   */
  const findDeviceTarget =
    useCallback(
      (query: string): Device[] => {
        const q = query
          .trim()
          .toLowerCase();

        if (!q) {
          return [];
        }

        const room = ROOMS.find(
          (roomItem) =>
            roomItem.name.toLowerCase() ===
              q ||
            q.startsWith(
              roomItem.name.toLowerCase() +
                ' '
            )
        );

        if (room) {
          const rest = q
            .slice(room.name.length)
            .trim();

          if (rest.includes('light')) {
            return devices.filter(
              (device) =>
                device.roomId === room.id &&
                device.category === 'light'
            );
          }

          if (
            rest.includes('ac') ||
            rest.includes('air condition')
          ) {
            return devices.filter(
              (device) =>
                device.roomId === room.id &&
                device.category === 'ac'
            );
          }

          return devices.filter(
            (device) =>
              device.roomId === room.id
          );
        }

        const matches = devices.filter(
          (device) => {
            const name = device.name
              .toLowerCase()
              .replace(
                /^(ceiling|smart|bedside|range)\s*/,
                ''
              );

            return (
              name.includes(q) ||
              device.name
                .toLowerCase()
                .includes(q)
            );
          }
        );

        if (matches.length > 0) {
          return matches;
        }

        if (
          q === 'fan' ||
          q.includes('fan')
        ) {
          return devices.filter(
            (device) =>
              device.category === 'fan'
          );
        }

        if (q.includes('light')) {
          return devices.filter(
            (device) =>
              device.category === 'light'
          );
        }

        if (
          q.includes('ac') ||
          q.includes('air condition')
        ) {
          return devices.filter(
            (device) =>
              device.category === 'ac'
          );
        }

        return [];
      },
      [devices]
    );

  /*
   * VOICE COMMANDS
   */
  const executeCommand = useCallback(
    (command: string) => {
      const lower =
        command.toLowerCase();

      let result: string;

      if (
        lower.includes('all lights off') ||
        lower === 'lights off' ||
        lower === 'turn off lights'
      ) {
        setAllLights(false);
        result =
          'Turned off all lights';
      } else if (
        lower.includes('all lights on') ||
        lower === 'lights on' ||
        lower === 'turn on lights'
      ) {
        setAllLights(true);
        result =
          'Turned on all lights';
      } else if (
        lower.includes('all devices off') ||
        lower.includes('everything off')
      ) {
        turnOffAllDevices();
        result =
          'Turned off all devices';
      } else if (
        lower.includes('turn on') ||
        lower.includes('switch on')
      ) {
        const targets =
          findDeviceTarget(
            lower
              .replace('turn on', '')
              .replace('switch on', '')
          );

        if (targets.length === 0) {
          result =
            `Could not find device for "${command}"`;
        } else {
          setDevices((prev) =>
            prev.map((device) =>
              targets.some(
                (target) =>
                  target.id === device.id
              )
                ? {
                    ...device,
                    isOn: true,
                  }
                : device
            )
          );

          result =
            `Turned on ${targets
              .map((target) => target.name)
              .join(', ')}`;
        }
      } else if (
        lower.includes('turn off') ||
        lower.includes('switch off')
      ) {
        const targets =
          findDeviceTarget(
            lower
              .replace('turn off', '')
              .replace('switch off', '')
          );

        if (targets.length === 0) {
          result =
            `Could not find device for "${command}"`;
        } else {
          setDevices((prev) =>
            prev.map((device) =>
              targets.some(
                (target) =>
                  target.id === device.id
              )
                ? {
                    ...device,
                    isOn: false,
                  }
                : device
            )
          );

          result =
            `Turned off ${targets
              .map((target) => target.name)
              .join(', ')}`;
        }
      } else {
        result =
          `Unrecognized command: "${command}"`;
      }

      setVoice((prev) => ({
        ...prev,
        status: 'success',
        statusMessage: result,
        lastResult: result,
        lastCommand: command,
      }));
    },
    [
      findDeviceTarget,
      setAllLights,
      turnOffAllDevices,
    ]
  );

  const startListening = useCallback(() => {
    if (voiceTimer.current) {
      clearTimeout(voiceTimer.current);
    }

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
        statusMessage:
          'Processing command...',
      }));

      voiceTimer.current =
        setTimeout(() => {
          const options = [
            'Turn on living room light',
            'Turn off bedroom fan',
            'Turn on all lights',
            'Turn off kitchen exhaust',
            'Turn on the air conditioner',
            'Turn off the television',
            'Lights off',
          ];

          const command =
            options[
              Math.floor(
                Math.random() *
                  options.length
              )
            ];

          setVoice((prev) => ({
            ...prev,
            lastCommand: command,
          }));

          executeCommand(command);
        }, 1300);
    }, 2400);
  }, [executeCommand]);

  const stopListening = useCallback(() => {
    if (voiceTimer.current) {
      clearTimeout(
        voiceTimer.current
      );
    }

    setVoice((prev) => ({
      ...prev,
      isListening: false,
      status: prev.lastCommand
        ? 'success'
        : 'idle',
      statusMessage: prev.lastCommand
        ? prev.statusMessage
        : 'Voice input cancelled',
    }));
  }, []);

  const value =
    useMemo<SmartHomeContextValue>(
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

  return (
    <SmartHomeContext.Provider value={value}>
      {children}
    </SmartHomeContext.Provider>
  );
}

export function useSmartHome(): SmartHomeContextValue {
  const ctx = useContext(SmartHomeContext);

  if (!ctx) {
    throw new Error(
      'useSmartHome must be used within SmartHomeProvider'
    );
  }

  return ctx;
}