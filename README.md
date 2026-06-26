# 🛡️ HomeWifiMonitor

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-green.svg)
![React 19](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=white)
![Django 6](https://img.shields.io/badge/Django-6-092E20.svg?logo=django&logoColor=white)
![Mitmproxy](https://img.shields.io/badge/Mitmproxy-Interception-red.svg)

**HomeWifiMonitor** is an enterprise-grade, real-time home network intelligence and security controller. It combines live hardware network scraping (ARP table inspection, DHCP lease parsing, UDP sub-net probes) with an advanced **Man-In-The-Middle (MITM) HTTPS Interception Proxy** to provide unprecedented visibility into connected devices, live bandwidth consumption, and visited websites across your home Wi-Fi.

---

## ✨ Key Features

- **📡 Live Network Telemetry**: Automatically scans your router's subnet to discover physical NICs, resolve hostnames, measure RSSI signal strength (`dBm`), and calculate upload/download throughput.
- **🛡️ Advanced HTTPS MITM Sniffing**: Deep packet inspection pipeline built on `mitmproxy` that intercepts managed HTTP/HTTPS requests, extracts domains/content-types/bandwidth, and asynchronously streams logs into Django.
- **📊 Interactive Modern UI Dashboard**: Built with React 19, Vite, and Recharts featuring dark-mode aesthetics, live activity feeds, real-time traffic graphs, and per-device DNS inspection modals.
- **🔒 Zero Privacy Leakage**: Designed specifically for local personal self-hosting. All telemetry is stored locally in SQLite with zero telemetry phoned home.

---

## 🏗️ System Architecture

The project is structured into three decoupled micro-services running locally:

```
+-------------------------------------------------------------------------+
|                        Connected Home Devices                           |
|       (Smartphones, Laptops, Smart TVs configured with Proxy)           |
+------------------------------------+------------------------------------+
                                     |
                                     v [HTTP / HTTPS Traffic : Port 8080]
+------------------------------------+------------------------------------+
|                🛡️ Mitmproxy Interception Server                        |
|                  (backend/proxy_service/mitm_interceptor.py)            |
|                                                                         |
|  - Captures requests & resolves hostnames via local socket lookup       |
|  - Buffers packets & transmits batch JSON payloads                      |
+------------------------------------+------------------------------------+
                                     |
                                     v [POST /api/proxy/ingest/ : Port 8000]
+------------------------------------+------------------------------------+
|                      🐍 Django Backend API                              |
|            (Django REST Framework + SQLite Database Engine)             |
|                                                                         |
|  - Ingests telemetry & manages network device inventory                 |
|  - Executes active sub-net pinging & OS ARP scraping                    |
+------------------------------------+------------------------------------+
                                     ^
                                     | [REST API : Port 5173]
+------------------------------------+------------------------------------+
|                     ⚛️ React Frontend Dashboard                         |
|        (Vite Dev Server + Lucide Icons + Dynamic Visualizations)        |
+-------------------------------------------------------------------------+
```

---

## 🔍 Deep Dive: The MITM Interception Pipeline

The flagship feature of **HomeWifiMonitor** is its custom `mitmproxy` add-on script ([mitm_interceptor.py](file:///backend/proxy_service/mitm_interceptor.py)). 

### How It Works:
1. **Traffic Routing**: When target wireless devices are set to use your host machine's IP on **Port 8080** as their HTTP Proxy, all web requests flow through `mitmdump`.
2. **Flow Filtering**: The custom class `NetMonitorProxyAddon` inspects `http.HTTPFlow` events. It filters out internal noise (e.g., localhost loopbacks, OS connectivity checks) and extracts metadata (`method`, `host`, `pretty_url`, `status_code`, `content_len`).
3. **Identity Resolution**: Client IP addresses are matched against a high-speed local memory cache (`client_name_cache`) or resolved via `socket.gethostbyaddr()` to tag logs with human-readable device names.
4. **Asynchronous Batch Ingestion**: To prevent blocking web browsing speeds, captured events are appended to a thread-safe memory buffer. A dedicated background daemon thread flushes the buffer every **1.5 seconds**, sending a batched `POST` request to the Django ingestion endpoint (`/api/proxy/ingest/`).

### Setting Up the MITM Proxy on Client Devices:

1. **Start the Interceptor Service**:
   Run the automated PowerShell script from your terminal:
   ```powershell
   cd backend\proxy_service
   .\start_proxy.ps1
   ```
   *Note: This starts `mitmdump` on port `8080` with pre-configured regex rules to bypass OS certificate pinning (Apple/Google telemetry).*

2. **Configure Client Wi-Fi Settings**:
   On any phone or computer connected to your Wi-Fi:
   - Go to **Wi-Fi Settings** -> **Modify Network** -> **Advanced Options**.
   - Set **Proxy** to `Manual`.
   - Set **Proxy Hostname** to the local IP address of the PC running HomeWifiMonitor (e.g., `192.168.1.9`).
   - Set **Proxy Port** to `8080`.

3. **Install the SSL CA Certificate** *(Required for HTTPS inspection)*:
   - On the proxied device, open any browser and navigate to the magic URL:
     **[http://mitm.it](http://mitm.it)**
   - Click the icon matching your device OS (iOS, Android, Windows, macOS) to download `mitmproxy-ca-cert.pem`.
   - **On Android/iOS**: Go to *Settings -> Security -> Encryption & Credentials -> Install a Certificate -> CA Certificate* and select the downloaded file to trust it.

Once completed, visit any website on the client device. You will immediately see live captured HTTP/HTTPS requests populating the **Live Proxy Feed** tab in your React dashboard!

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- **Python** v3.10 or higher
- **Node.js** v18 or higher
- **Mitmproxy** (`pip install mitmproxy`)

### 1. Start the Backend API Server
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### 2. Start the Frontend Dashboard
```powershell
cd frontend
npm install
npm run dev
```

Open your browser to `http://localhost:5173/` to launch the control plane.

---

## ⚠️ Security & Privacy Disclaimer

**HomeWifiMonitor** is created strictly for educational purposes, personal self-auditing, and network diagnostics on infrastructure you explicitly own and operate. Intercepting network traffic without explicit consent of device owners may violate local laws and privacy regulations. The authors assume no liability for misuse of this software.
