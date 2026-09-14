# Smart Home: Bluetooth Home Automation Simulator

A college project that simulates a smart home without physical hardware. The laptop web simulator displays the home environment, while an Expo Go mobile app provides a second controller. Both interfaces control the same devices through real-time Wi-Fi WebSocket synchronization.

## Project Overview

The system contains 11 virtual devices in three rooms:

- Living Room: Ceiling Light, Fan, Air Conditioner, Television
- Bedroom: Light, Fan, Air Conditioner, Bedside Lamp
- Kitchen: Kitchen Light, Exhaust Fan, Refrigerator

The laptop and mobile controller share device states through a WebSocket live bridge hosted by the laptop.

## Features

- 11 virtual smart-home devices
- Living Room, Bedroom, and Kitchen views
- Laptop web simulator with visual device states
- Expo Go mobile controller
- Phone-to-laptop and laptop-to-phone synchronization
- Quick Controls for all lights and all devices
- Connection, disconnection, and reconnection handling
- Stable Vite server with WebSocket path `/ws`
- No physical Bluetooth or IoT hardware required

## System Architecture

```text
Laptop: React + Vite  <---- Wi-Fi / WebSocket ---->  Phone: Expo Go
       Web simulator          /ws                   Mobile controller
       Live bridge
       Port 5173
```

Both clients use the same room-and-device state format:

```json
{
  "livingRoom": { "light": true, "fan": false, "ac": false, "tv": true },
  "bedroom": { "light": false, "fan": false, "ac": true, "lamp": true },
  "kitchen": { "light": true, "exhaust": false, "refrigerator": true }
}
```

## Technologies Used

### Laptop application

- React
- Vite
- JavaScript and JSX
- Node.js
- `ws` WebSocket library
- CSS

### Mobile application

- React Native
- Expo Go
- Expo Router
- TypeScript
- AsyncStorage for the saved laptop address

## Project Setup

### Prerequisites

- Node.js and npm
- Expo Go installed on the mobile phone
- Laptop and phone connected to the same Wi-Fi network

Install laptop dependencies from the project root:

```bash
npm install
```

Install mobile dependencies:

```bash
cd smart-home-mobile
npm install
cd ..
```

## Run the Laptop Server

From the project root:

```bash
npm run dev
```

The laptop application runs on port `5173`:

```text
http://localhost:5173
```

For a phone on the same network, use the laptop Wi-Fi IPv4 address, for example:

```text
http://10.213.99.57:5173
```

Port `5173` must be available because the Vite server is configured with a strict port.

## Run the Expo Mobile App

From the project root:

```bash
cd smart-home-mobile
npm start
```

Scan the displayed QR code with Expo Go. Keep the phone and laptop on the same Wi-Fi network.

## Connect the Phone to the Laptop

1. Start the laptop server with `npm run dev`.
2. Find the laptop Wi-Fi IP address from the Vite network URL or system network settings.
3. Open the mobile app connection screen.
4. Enter the laptop IP address, such as `10.213.99.57`.
5. Enter port `5173`.
6. Select **Connect**.
7. Confirm `11 of 11 devices synced`.

The phone connects to:

```text
ws://<laptop-wifi-ip>:5173/ws
```

## WebSocket Synchronization

The live bridge accepts WebSocket upgrades only on `/ws`, keeping the Vite HMR connection separate.

1. A client connects to `/ws`.
2. The client sends a `hello` message with role `controller` or `phone`.
3. The bridge sends a `welcome` message containing the current state.
4. A local device change is sent as a `sync` message.
5. The bridge validates room and device keys, updates its in-memory state, and broadcasts a `state` message to the other clients.
6. Clients apply the received state to their local device list.
7. Duplicate states are ignored to prevent unnecessary broadcasts and echo loops.
8. Clients retry the connection if the WebSocket closes.

Example messages:

```json
{ "type": "hello", "role": "phone" }
```

```json
{ "type": "sync", "state": { "livingRoom": { "light": false } } }
```

## Testing Results

The project was tested with:

- All 11 devices across all three rooms
- All Lights ON control
- All Lights OFF control
- All Devices OFF control
- Phone-to-laptop synchronization
- Laptop-to-phone synchronization
- Connection and reconnection behavior
- Stable browser navigation without an automatic reload loop
- Production build using `npm run build`

Run the production build check with:

```bash
npm run build
```

## Future Scope

- Connect the simulator to real IoT hardware
- Add scheduled automation rules
- Add user accounts and multiple homes
- Add energy usage monitoring
- Add push notifications
- Add voice assistant integration
- Store state history and device activity reports

## Conclusion

The Smart Home Simulator demonstrates how a laptop dashboard and a mobile controller can manage virtual household devices through a shared real-time WebSocket connection. It provides a practical and low-cost environment for learning smart-home architecture and IoT communication concepts.