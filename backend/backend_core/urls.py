from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_landing(request):
    return JsonResponse({
        "system": "Airtel Xstream Fiber Network Controller Backend",
        "status": "Online & Polling Wi-Fi Adapter",
        "version": "v2.1.0_Live",
        "available_api_endpoints": {
            "router_info": "http://127.0.0.1:8000/api/router-info/",
            "connected_devices": "http://127.0.0.1:8000/api/devices/",
            "network_bandwidth_stats": "http://127.0.0.1:8000/api/stats/",
            "live_activity_stream": "http://127.0.0.1:8000/api/activity/",
            "browsing_history_sample": "http://127.0.0.1:8000/api/devices/1/dns/"
        }
    }, json_dumps_params={'indent': 2})

urlpatterns = [
    path('', api_landing),
    path('admin/', admin.site.urls),
    path('api/', include('network.urls')),
]
