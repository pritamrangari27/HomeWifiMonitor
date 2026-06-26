import random
import datetime
from .base_driver import BaseRouterDriver

class MockRouterDriver(BaseRouterDriver):
    def get_router_info(self):
        return {
            "router_name": f"{self.config.brand} Home Fiber",
            "router_model": self.config.model or "H660GM-A",
            "ip_address": self.config.ip_address,
            "firmware_version": "v2.1.0_Airtel",
            "internet_status": "Connected (Simulated)",
            "uptime": "5 days, 12 hours",
            "download_speed": 310.5,
            "upload_speed": 105.2,
            "wifi_ssid": getattr(self.config, 'wifi_ssid', 'Home_WiFi'),
            "wifi_ssid_5g": getattr(self.config, 'wifi_ssid_5g', 'Home_WiFi_5G'),
            "wifi_password": getattr(self.config, 'wifi_password', 'password123'),
            "wan_mac": getattr(self.config, 'wan_mac', 'AA:BB:CC:DD:EE:FF'),
            "serial_number": getattr(self.config, 'serial_number', 'ROUTER12345678'),
            "data_source": "Simulated (Mock Fallback)"
        }

    def get_connected_devices(self):
        return [
            {
                "id": 1,
                "device_name": "Work-Laptop",
                "ip_address": "192.168.1.105",
                "mac_address": "A1:B2:C3:D4:E5:F6",
                "connection_type": "Wi-Fi",
                "signal_strength": "Excellent",
                "status": "Online",
                "data_usage": "18.2 GB"
            },
            {
                "id": 2,
                "device_name": "User-Smartphone",
                "ip_address": "192.168.1.112",
                "mac_address": "44:55:66:77:88:99",
                "connection_type": "Wi-Fi",
                "signal_strength": "Good",
                "status": "Online",
                "data_usage": "6.4 GB"
            },
            {
                "id": 3,
                "device_name": "Smart-TV-LivingRoom",
                "ip_address": "192.168.1.150",
                "mac_address": "AA:BB:CC:11:22:33",
                "connection_type": "Ethernet",
                "signal_strength": "N/A",
                "status": "Online",
                "data_usage": "84.1 GB"
            },
            {
                "id": 4,
                "device_name": "Guest-Device",
                "ip_address": "192.168.1.180",
                "mac_address": "99:88:77:AA:BB:CC",
                "connection_type": "Wi-Fi",
                "signal_strength": "Fair",
                "status": "Offline",
                "data_usage": "0.5 GB"
            }
        ]

    def get_network_stats(self):
        return {
            "traffic_data": [
                {"time": "00:00", "upload": 12, "download": 50},
                {"time": "04:00", "upload": 8, "download": 25},
                {"time": "08:00", "upload": 45, "download": 180},
                {"time": "12:00", "upload": 95, "download": 320},
                {"time": "16:00", "upload": 70, "download": 280},
                {"time": "20:00", "upload": 40, "download": 150},
            ],
            "devices_over_time": [
                {"time": "00:00", "count": 4},
                {"time": "04:00", "count": 3},
                {"time": "08:00", "count": 5},
                {"time": "12:00", "count": 6},
                {"time": "16:00", "count": 5},
                {"time": "20:00", "count": 4},
            ],
            "total_bandwidth": {
                "download": "108.8 GB",
                "upload": "25.1 GB"
            }
        }

    def get_activity_logs(self):
        now = datetime.datetime.now()
        return [
            {
                "id": 1,
                "timestamp": (now - datetime.timedelta(minutes=10)).isoformat(),
                "event": "Device Connected",
                "details": "User-Smartphone joined Home_WiFi Wi-Fi."
            },
            {
                "id": 2,
                "timestamp": (now - datetime.timedelta(hours=1)).isoformat(),
                "event": "High Streaming Usage",
                "details": "Smart-TV-LivingRoom consumed > 25Mbps video stream."
            },
            {
                "id": 3,
                "timestamp": (now - datetime.timedelta(hours=5)).isoformat(),
                "event": "Settings Updated",
                "details": "Admin updated router monitoring target IP."
            }
        ]

    def get_dns_logs(self, device_id):
        now = datetime.datetime.now()
        sites = [
            {"domain": "google.com", "url": "https://www.google.com/search?q=network+monitoring"},
            {"domain": "github.com", "url": "https://github.com/example"},
            {"domain": "instagram.com", "url": "https://www.instagram.com/"},
            {"domain": "youtube.com", "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
            {"domain": "netflix.com", "url": "https://www.netflix.com/browse"},
            {"domain": "apple.com", "url": "https://www.apple.com/in/store"},
            {"domain": "airtel.in", "url": "https://www.airtel.in/myplan-payments"},
            {"domain": "amazon.in", "url": "https://www.amazon.in/gp/bestsellers"},
            {"domain": "stackoverflow.com", "url": "https://stackoverflow.com/questions/tagged/reactjs"}
        ]
        logs = []
        for i in range(15):
            site = random.choice(sites)
            logs.append({
                "id": i + 1,
                "timestamp": (now - datetime.timedelta(minutes=i*2)).isoformat(),
                "domain": site["domain"],
                "url": site["url"],
                "status": random.choice(["Resolved", "Resolved", "Resolved", "Blocked"]),
                "ip_resolved": f"{random.randint(10, 200)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"
            })
        return logs
