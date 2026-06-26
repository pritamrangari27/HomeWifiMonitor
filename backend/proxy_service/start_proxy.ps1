# Start NetMonitor Mitmproxy Service on Port 8080
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "      🛡️ NetMonitor Mitmproxy Interception Server" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Listening on Port : 8080" -ForegroundColor Yellow
Write-Host "Backend Ingestion : http://127.0.0.1:8000/api/proxy/ingest/" -ForegroundColor Yellow
Write-Host "SSL CA Certificate: ~/.mitmproxy/mitmproxy-ca-cert.pem" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if mitmdump is installed in venv or global
$ignoreRegex = "connectivitycheck\.gstatic\.com|www\.google\.com|clients3\.google\.com|.*\.apple\.com"
if (Test-Path "..\venv\Scripts\mitmdump.exe") {
    ..\venv\Scripts\mitmdump.exe -s .\mitm_interceptor.py --set listen_port=8080 --ignore-hosts $ignoreRegex
} elseif (Get-Command "mitmdump" -ErrorAction SilentlyContinue) {
    mitmdump -s .\mitm_interceptor.py --set listen_port=8080 --ignore-hosts $ignoreRegex
} elseif (Get-Command "mitmproxy" -ErrorAction SilentlyContinue) {
    mitmproxy -s .\mitm_interceptor.py --set listen_port=8080 --ignore-hosts $ignoreRegex
} else {
    Write-Host "❌ Error: 'mitmdump' or 'mitmproxy' is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install mitmproxy via: pip install mitmproxy" -ForegroundColor Yellow
}
