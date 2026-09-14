<div align="center">

# 🏠 Smart Home Simulator

### ⚡ Bluetooth Home Automation • IoT • Real-Time WebSocket Synchronization

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=2500&pause=800&color=00C2FF&center=true&vCenter=true&width=750&lines=Virtual+Smart+Home+Automation;React+%2B+Vite+%2B+WebSocket;Laptop+%E2%86%94+Mobile+Real-Time+Control;11+Virtual+Devices+%7C+3+Rooms" alt="Typing Animation" />

<br>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Open%20Simulator-00C2FF?style=for-the-badge)](https://smart-home-simulator-olive.vercel.app/)
[![GitHub](https://img.shields.io/badge/💻%20Source%20Code-GitHub-181717?style=for-the-badge\&logo=github)](https://github.com/yagantieswarkurukunda6300-cell/smart-home-simulator)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Fast%20Build-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)](https://vitejs.dev/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--Time-FF6B35?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

</div>

---

## 🚀 Project Overview

**Smart Home Simulator** is a college project that simulates a complete smart-home environment **without requiring physical hardware**.

The system provides two connected interfaces:

* 💻 **Laptop Web Simulator** — visualizes and controls the smart-home environment.
* 📱 **Expo Go Mobile Controller** — provides a second controller for the same virtual devices.
* 🔄 **WebSocket Live Bridge** — synchronizes device states between laptop and mobile in real time.
* 📡 **Wi-Fi Communication** — allows both interfaces to communicate through the same local network.

The project demonstrates the core idea behind **IoT-based smart-home automation** using a software-only environment.

---

## ✨ Key Features

| Feature                 | Description                                      |
| ----------------------- | ------------------------------------------------ |
| 🏠 11 Virtual Devices   | Simulates common household appliances            |
| 🛋️ 3 Rooms             | Living Room, Bedroom & Kitchen                   |
| 💻 Web Simulator        | Laptop-based visual smart-home dashboard         |
| 📱 Mobile Controller    | Expo Go based second controller                  |
| 🔄 Real-Time Sync       | Laptop ↔ Phone device-state synchronization      |
| ⚡ Quick Controls        | Control all lights or all devices quickly        |
| 📡 WebSocket Bridge     | Live communication through `/ws`                 |
| 🔌 Connection Handling  | Connection, disconnection & reconnection support |
| 🧩 No Hardware Required | Entire system works as a virtual simulator       |

---

## 🏠 Smart Home Environment

The simulator contains **11 virtual devices across 3 rooms**.

### 🛋️ Living Room

* 💡 Ceiling Light
* 🌀 Fan
* ❄️ Air Conditioner
* 📺 Television

### 🛏️ Bedroom

* 💡 Light
* 🌀 Fan
* ❄️ Air Conditioner
* 🛋️ Bedside Lamp

### 🍳 Kitchen

* 💡 Kitchen Light
* 🌬️ Exhaust Fan
* 🧊 Refrigerator

---

## 🧠 System Architecture

```text
                    ┌──────────────────────────┐
                    │       SMART HOME         │
                    │        STATE             │
                    │                          │
                    │  11 Virtual Devices      │
                    │  3 Rooms                 │
                    └────────────┬─────────────┘
                                 │
                         WebSocket / Wi-Fi
                                 │
                ┌────────────────┴────────────────┐
                │                                 │
                ▼                                 ▼
      ┌──────────────────┐             ┌──────────────────┐
      │      LAPTOP      │             │      PHONE       │
      │                  │             │                  │
      │ React + Vite     │◄───────────►│ Expo Go          │
      │ Web Simulator    │  Real-Time  │ Mobile Controller │
      │                  │ Synchronize │                  │
      └──────────────────┘             └──────────────────┘
                │
                │
                ▼
          WebSocket Path
              `/ws`
```

### 🔄 Communication Flow

```text
User Action
     │
     ▼
Device State Changes
     │
     ▼
WebSocket Message
     │
     ▼
Live Bridge
     │
     ├──────────────► Laptop Simulator
     │
     └──────────────► Mobile Controller
                         │
                         ▼
                  Same Device State
```

---

## 📡 Real-Time Synchronization

Both clients use the same room-and-device state structure.

Example:

```json
{
  "livingRoom": {
    "light": true,
    "fan": false,
    "ac": false,
    "tv": true
  },
  "bedroom": {
    "light": false,
    "fan": false,
    "ac": true,
    "lamp": true
  },
  "kitchen": {
    "light": true,
    "exhaustFan": false,
    "refrigerator": true
  }
}
```

When a device is changed from one interface, the updated state is synchronized with the other connected interface through the WebSocket bridge.

---

## 🛠️ Technology Stack

<div align="center">

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--Time-FF6B35?style=for-the-badge)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge\&logo=expo\&logoColor=white)
![Wi-Fi](https://img.shields.io/badge/Wi--Fi-Communication-0A66C2?style=for-the-badge)

</div>

### 💻 Frontend

**React + Vite**

Used to build the laptop-based interactive smart-home simulator.

### 📱 Mobile

**Expo Go**

Used as the mobile controller for controlling the same virtual devices.

### 🔄 Communication

**WebSocket**

Provides real-time bidirectional communication between the laptop simulator and mobile controller.

### 📡 Network

**Wi-Fi**

Allows the laptop and phone to communicate within the same network environment.

---

## 🎮 How It Works

### 1️⃣ Launch the Web Simulator

The laptop runs the React + Vite smart-home interface.

### 2️⃣ Connect the Mobile Controller

The Expo Go application provides a second control interface.

### 3️⃣ Connect Through Wi-Fi

Both devices communicate through the same network.

### 4️⃣ Control Virtual Devices

Users can switch devices ON/OFF from either interface.

### 5️⃣ Synchronize State

The WebSocket bridge broadcasts state changes between connected clients.

### 6️⃣ Observe Real-Time Updates

A change made on the laptop can be reflected on the mobile controller, and vice versa.

---

## ⚡ Quick Controls

The simulator provides centralized controls for faster operation.

### 💡 All Lights

Control the lights across the smart home.

### 🏠 All Devices

Control the complete virtual-device environment.

This demonstrates how centralized control can be implemented in a smart-home automation system.

---

## 🔌 Connection Handling

The system also demonstrates basic communication-state handling:

```text
CONNECTED
    │
    ▼
REAL-TIME COMMUNICATION
    │
    ├──────────────► Device State Updates
    │
    ▼
DISCONNECTED
    │
    ▼
RECONNECTION
    │
    ▼
CONNECTED AGAIN
```

The WebSocket communication uses the dedicated:

```text
/ws
```

path for the live bridge.

---

## 🎯 Project Objectives

The main objectives of this project are:

* Understand smart-home automation architecture.
* Learn real-time client-to-client synchronization.
* Understand WebSocket communication.
* Connect a web interface with a mobile controller.
* Simulate IoT devices without physical hardware.
* Understand shared device-state management.
* Demonstrate centralized and remote device control.

---

## 🌍 Real-World Applications

The architecture demonstrated by this simulator can be extended toward:

* 🏠 Smart Home Automation
* 💡 Intelligent Lighting Systems
* 🌡️ Smart HVAC Control
* 🔌 Appliance Automation
* 📱 Remote Device Monitoring
* 📡 IoT Communication Systems
* ⚡ Energy Management Systems
* 🏢 Smart Building Automation

---

## 📊 Project Highlights

<div align="center">

| 🏠 Rooms | ⚡ Devices | 📱 Controllers | 📡 Communication |
| :------: | :-------: | :------------: | :--------------: |
|   **3**  |   **11**  |      **2**     |   **WebSocket**  |

</div>

---

## 💡 Why This Project?

Traditional IoT projects often require sensors, microcontrollers, relays and physical appliances.

This project takes a **software-first approach**.

Instead of depending on physical hardware, the simulator creates a virtual environment where the complete control and communication flow can be demonstrated.

This makes it useful for:

* 🎓 College demonstrations
* 🧪 IoT learning
* 🏠 Smart-home architecture experiments
* 💻 WebSocket practice
* 📱 Mobile + web integration
* 🚀 Future hardware implementation

---

## 🔮 Future Expansion

The simulator can be extended in the future with:

* 🌡️ Temperature sensors
* 💧 Humidity sensors
* ⚡ Energy monitoring
* 🔐 Smart door locks
* 📷 Security cameras
* 🚨 Intrusion alerts
* 🎙️ Voice control
* 🤖 AI-based automation
* ☁️ Cloud IoT integration
* 🔋 Smart energy optimization

---

## 🌐 Live Project

<div align="center">

### 🚀 Try the Smart Home Simulator

[![Open Live Demo](https://img.shields.io/badge/🚀%20OPEN%20LIVE%20DEMO-Smart%20Home%20Simulator-00C2FF?style=for-the-badge\&labelColor=111827)](https://smart-home-simulator-olive.vercel.app/)

### 💻 Explore the Source Code

[![GitHub Repository](https://img.shields.io/badge/💻%20VIEW%20SOURCE-GitHub-181717?style=for-the-badge\&logo=github)](https://github.com/yagantieswarkurukunda6300-cell/smart-home-simulator)

</div>

---

## 👨‍💻 Developer

<div align="center">

# KURUKUNDA YAGANTI ESWAR

**Electrical Engineering • AI • IoT**

Building practical engineering projects by combining **Electrical Engineering, Automation, IoT and modern software technologies.**

[![Portfolio](https://img.shields.io/badge/🌐%20Portfolio-yaganti--eswar--portfolio-00C2FF?style=for-the-badge)](https://yaganti-eswar-portfolio.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-yagantieswarkurukunda6300--cell-181717?style=for-the-badge\&logo=github)](https://github.com/yagantieswarkurunda6300-cell)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Yaganti%20Eswar-0A66C2?style=for-the-badge\&logo=linkedin\&logoColor=white)](https://www.linkedin.com/in/yaganti-eswar-kurukunda-7027132b2)

</div>

---

<div align="center">

### ⚡ Engineering • Automation • IoT • AI

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00C2FF,50:7C3AED,100:FF6B35&height=120&section=footer" width="100%" />

</div>
