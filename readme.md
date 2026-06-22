# 🛡️ SafeSteel AI – Industrial Safety Intelligence Platform

> **Predict Before It Happens**

SafeSteel AI is an AI-powered Industrial Safety Intelligence Platform designed for steel manufacturing plants. It combines IoT sensors, Computer Vision, Digital Twin visualization, AI-powered risk analysis, emergency response, and an intelligent safety copilot into a single dashboard.

The project demonstrates how Artificial Intelligence can predict industrial accidents **before** they happen by correlating multiple safety signals instead of reacting after an incident occurs.

---

# 📌 Problem Statement

Steel manufacturing plants operate in hazardous environments where multiple independent events such as:

* Gas leaks
* High temperatures
* Pressure spikes
* PPE violations
* Hot work activities

may individually appear harmless but together can create life-threatening situations.

Traditional monitoring systems generate isolated alarms, requiring operators to manually correlate events.

SafeSteel AI automates this process using AI.

---

# 🚀 Features

## 🏭 Plant Digital Twin

* Interactive plant visualization
* Live monitored zones
* Worker tracking
* Zone-wise risk status
* Digital plant overview

---

## 🤖 AI Compound Risk Engine

Instead of detecting single events, the platform correlates multiple signals including:

* Methane concentration
* Temperature
* Pressure
* PPE compliance
* Worker proximity
* Hot Work Permits
* Ventilation status

The AI calculates an overall plant risk score and predicts potential accidents before they occur.

---

## 📷 Vision AI Surveillance

Computer Vision dashboard capable of detecting:

* Helmet compliance
* High Visibility Vest detection
* Restricted area violations
* Worker tracking
* Safety alerts

---

## 📊 Live Sensor Monitoring

Real-time visualization of:

* Methane (CH₄)
* Temperature
* Pressure
* Explosion probability

using animated charts.

---

## 🌦️ Weather Intelligence

Live weather integration provides:

* Temperature
* Humidity
* Wind speed
* Weather conditions

The system estimates how external environmental conditions affect gas dispersion and industrial safety.

---

## 🧠 AI Safety Copilot

Interactive assistant capable of answering questions like:

* Current plant risk
* Hazard explanation
* Evacuation plan
* Worker safety status
* Zone monitoring

---

## 🚨 Emergency Response Center

When compound risk exceeds the threshold, the system automatically:

* Activates emergency mode
* Starts evacuation countdown
* Generates response workflow
* Notifies responsible personnel
* Displays evacuation route on Google Maps

---

## 🗺️ Smart Evacuation Map

Integrated Google Maps visualization showing:

* Danger zone
* Assembly point
* Evacuation route
* Live emergency navigation

---

## 📡 Live Event Stream

Displays correlated real-time events including:

* Sensor alerts
* Vision AI detections
* System decisions
* Emergency actions
* Weather updates

---

# 🏗️ Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)

---

## APIs Used

### 🤖 Google Gemini API

AI-powered Safety Copilot

---

### 🌦️ OpenWeather API

Live weather information

---

### 🗺️ Google Maps JavaScript API

Emergency evacuation visualization

---

### 📷 Roboflow Inference API *(Optional)*

Vision AI object detection

---

### 📈 ThingsBoard / MQTT *(Optional)*

Live IoT sensor simulation

---

# 📂 Project Structure

```
SafeSteel-AI/

│

├── index.html

├── styles.css

├── app.js

├── assets/

│   ├── images/

│   ├── icons/

│

├── README.md

└── LICENSE
```

---

# 🧠 AI Workflow

```
IoT Sensors
        │
        ▼
Live Sensor Stream
        │
        ▼
Computer Vision
        │
        ▼
Signal Correlation Engine
        │
        ▼
AI Compound Risk Prediction
        │
        ▼
Emergency Decision Engine
        │
        ▼
Evacuation + Notifications
```

---

# 🎯 Simulation Scenario

The demo simulates an industrial emergency inside a Coke Oven Battery.

Sequence:

1. Methane concentration begins increasing
2. Hot Work Permit becomes active
3. Vision AI detects missing helmet
4. Pressure increases
5. AI correlates all signals
6. Risk score exceeds threshold
7. Emergency protocol activated
8. Evacuation route generated
9. Personnel notified
10. Incident report generated

---

# 📈 Future Enhancements

* Drone Surveillance
* Thermal Camera Integration
* Wearable Worker Tracking
* Predictive Maintenance
* LLM-based Incident Report Generation
* Voice-enabled Safety Assistant
* Edge AI Deployment
* SAP Integration
* Digital Permit-to-Work System
* Live CCTV Streaming

---

# 💡 Why SafeSteel AI?

Unlike conventional safety dashboards that display isolated alarms, SafeSteel AI correlates multiple independent signals to predict accidents before they occur.

The platform demonstrates how AI can transform industrial safety from reactive monitoring to proactive prevention.

---

# 👨‍💻 Developed By

**Kunal kumar**

Industrial Safety Intelligence Platform

Hackathon Prototype

---

# 📜 License

This project is developed for educational, research, and hackathon demonstration purposes.
