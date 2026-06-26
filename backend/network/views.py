from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services.router_service import RouterService
from .models import RouterConfig, ProxyLog, ManagedDevice
from .serializers import RouterConfigSerializer, ProxyLogSerializer, ManagedDeviceSerializer
from django.db.models import Sum, Count
import datetime

class RouterInfoView(APIView):
    def get(self, request):
        return Response(RouterService.get_router_info())

class ConnectedDevicesView(APIView):
    def get(self, request):
        return Response(RouterService.get_connected_devices())

class NetworkStatsView(APIView):
    def get(self, request):
        return Response(RouterService.get_network_stats())

class ActivityLogsView(APIView):
    def get(self, request):
        return Response(RouterService.get_activity_logs())

class DeviceDNSLogsView(APIView):
    def get(self, request, device_id):
        devices = RouterService.get_connected_devices()
        target_dev = next((d for d in devices if str(d.get('id')) == str(device_id) or str(d.get('mac_address')) == str(device_id)), None)
        
        if target_dev:
            ip = target_dev.get('ip_address', '')
            name = target_dev.get('device_name', '')
            qs = ProxyLog.objects.none()
            if ip:
                qs = qs | ProxyLog.objects.filter(ip_address=ip)
            if name and name != 'Unknown':
                qs = qs | ProxyLog.objects.filter(device_name__icontains=name)
                
            logs = qs.distinct().order_by('-timestamp')[:25]
            if logs:
                res = []
                for l in logs:
                    res.append({
                        "id": l.id,
                        "timestamp": l.timestamp.isoformat(),
                        "domain": l.domain,
                        "url": l.full_url or f"https://{l.domain}",
                        "status": f"HTTP {l.status_code}",
                        "ip_resolved": f"{round(l.response_bytes/1024, 1)} KB" if l.response_bytes else "Captured"
                    })
                return Response(res)
                
        return Response([])

class RouterSettingsView(APIView):
    def get(self, request):
        config = RouterConfig.get_solo()
        serializer = RouterConfigSerializer(config)
        return Response(serializer.data)

    def post(self, request):
        config = RouterConfig.get_solo()
        serializer = RouterConfigSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            # Actively test connection to target router IP
            from .services.drivers.airtel_driver import AirtelRouterDriver
            driver = AirtelRouterDriver(serializer.instance)
            is_connected = driver._is_reachable()
            
            res_data = serializer.data
            res_data['connection_test'] = {
                'status': 'success' if is_connected else 'warning',
                'message': f"Successfully connected to Airtel Router ({serializer.instance.ip_address}) and tracking live data!" if is_connected else f"Settings saved. Notice: Could not reach router at {serializer.instance.ip_address}. Currently running in Simulated Fallback mode."
            }
            return Response(res_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProxyIngestionView(APIView):
    """
    Ingest batched logs transmitted asynchronously by the standalone mitmproxy add-on script.
    """
    def post(self, request):
        token = request.headers.get('X-Proxy-Token', '')
        config = RouterConfig.get_solo()
        if config.api_token and token != config.api_token:
            return Response({"error": "Unauthorized proxy ingestion token"}, status=status.HTTP_401_UNAUTHORIZED)

        logs_data = request.data.get('logs', [])
        if not isinstance(logs_data, list):
            return Response({"error": "Logs must be a list"}, status=status.HTTP_400_BAD_REQUEST)

        from django.utils import timezone
        created_count = 0
        for item in logs_data:
            try:
                ts_str = item.get('timestamp')
                if ts_str and isinstance(ts_str, str):
                    try:
                        ts = datetime.datetime.fromisoformat(ts_str)
                        if timezone.is_aware(timezone.now()) and timezone.is_naive(ts):
                            ts = timezone.make_aware(ts)
                    except Exception:
                        ts = timezone.now()
                else:
                    ts = timezone.now()

                ProxyLog.objects.create(
                    device_name=item.get('device_name', 'Unknown Client'),
                    ip_address=item.get('ip_address', '127.0.0.1'),
                    mac_address=item.get('mac_address', 'XX:XX:XX:XX:XX:XX'),
                    timestamp=ts,
                    http_method=item.get('http_method', 'GET'),
                    domain=item.get('domain', 'unknown'),
                    full_url=item.get('full_url', ''),
                    status_code=int(item.get('status_code', 200)),
                    response_bytes=int(item.get('response_bytes', 0)),
                    content_type=item.get('content_type', '')
                )
                created_count += 1
            except Exception as e:
                pass

        # Prune logs older than 7 days
        cutoff = timezone.now() - datetime.timedelta(days=7)
        ProxyLog.objects.filter(timestamp__lt=cutoff).delete()

        return Response({"status": "ingested", "count": created_count}, status=status.HTTP_201_CREATED)

class ProxyLogsFeedView(APIView):
    """
    Retrieve paginated/filtered feed of intercepted HTTPS requests for the real-time UI dashboard.
    """
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        limit = int(request.query_params.get('limit', 100))
        
        qs = ProxyLog.objects.all()
        if query:
            qs = qs.filter(domain__icontains=query) | qs.filter(device_name__icontains=query) | qs.filter(full_url__icontains=query)
            
        logs = qs[:limit]
        serializer = ProxyLogSerializer(logs, many=True)
        return Response(serializer.data)

class ProxyStatsView(APIView):
    """
    Aggregate total requests, sniffing bandwidth, and top visited HTTPS domains.
    """
    def get(self, request):
        total_reqs = ProxyLog.objects.count()
        total_bytes = ProxyLog.objects.aggregate(total=Sum('response_bytes'))['total'] or 0
        
        top_domains = ProxyLog.objects.values('domain').annotate(count=Count('id')).order_by('-count')[:8]
        active_clients = ProxyLog.objects.values('mac_address').distinct().count()
        
        return Response({
            "total_requests": total_reqs,
            "total_bandwidth_sniffed_bytes": total_bytes,
            "total_bandwidth_formatted": f"{round(total_bytes / (1024*1024), 2)} MB" if total_bytes > 1024*1024 else f"{round(total_bytes / 1024, 2)} KB",
            "active_proxied_clients": active_clients,
            "top_domains": list(top_domains)
        })
