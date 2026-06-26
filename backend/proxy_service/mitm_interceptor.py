"""
Production Mitmproxy Add-On Interceptor Script
Author: NetMonitor Team

Run via: mitmdump -s mitm_interceptor.py --set listen_port=8080
Intercepts HTTP/HTTPS traffic from managed network devices and asynchronously pushes telemetry to Django backend.
"""
import time
import json
import socket
import urllib.request
import threading
from mitmproxy import http
from mitmproxy import ctx

class NetMonitorProxyAddon:
    def __init__(self):
        self.backend_url = "http://127.0.0.1:8000/api/proxy/ingest/"
        self.api_token = ""
        self.batch_buffer = []
        self.lock = threading.Lock()
        self.client_name_cache = {}
        
        # Start background transmission loop
        self.running = True
        self.sender_thread = threading.Thread(target=self._transmission_loop, daemon=True)
        self.sender_thread.start()
        ctx.log.info("🛡️ NetMonitor Mitmproxy Interceptor Add-On Initialized on Port 8080!")

    def _resolve_client_identity(self, ip):
        if ip in self.client_name_cache:
            return self.client_name_cache[ip]
        try:
            name = socket.gethostbyaddr(ip)[0].split(".")[0]
        except Exception:
            name = f"Proxied Client ({ip})"
        self.client_name_cache[ip] = name
        return name

    def response(self, flow: http.HTTPFlow):
        host = flow.request.host.lower()
        if "127.0.0.1" in host or "localhost" in host:
            return

        ctx.log.info(f"⚡ MITM CAPTURED: {flow.request.method} {flow.request.pretty_url}")

        client_ip = "127.0.0.1"
        if flow.client_conn and flow.client_conn.peername:
            client_ip = flow.client_conn.peername[0]

        client_name = self._resolve_client_identity(client_ip)
        
        content_len = 0
        if flow.response and flow.response.content:
            content_len = len(flow.response.content)

        content_type = ""
        if flow.response and flow.response.headers:
            content_type = flow.response.headers.get("content-type", "").split(";")[0]

        log_event = {
            "device_name": client_name,
            "ip_address": client_ip,
            "mac_address": f"PROXY-{client_ip}",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S", time.localtime()),
            "http_method": flow.request.method,
            "domain": flow.request.host,
            "full_url": flow.request.pretty_url,
            "status_code": flow.response.status_code if flow.response else 0,
            "response_bytes": content_len,
            "content_type": content_type
        }

        with self.lock:
            self.batch_buffer.append(log_event)

    def _flush_batch(self):
        with self.lock:
            if not self.batch_buffer:
                return
            payload = {"logs": list(self.batch_buffer)}
            self.batch_buffer.clear()

        try:
            data = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(
                self.backend_url,
                data=data,
                headers={
                    "Content-Type": "application/json",
                    "X-Proxy-Token": self.api_token
                },
                method="POST"
            )
            opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
            with opener.open(req, timeout=3.0) as resp:
                ctx.log.info(f"✅ SUCCESSFULLY INGESTED {len(payload['logs'])} LOGS INTO DJANGO!")
        except Exception as err:
            ctx.log.error(f"❌ DJANGO INGESTION FAILED: {err}")

    def _transmission_loop(self):
        while self.running:
            time.sleep(1.5)
            self._flush_batch()

addons = [
    NetMonitorProxyAddon()
]
