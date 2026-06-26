from django.urls import path
from .views import RouterInfoView, ConnectedDevicesView, NetworkStatsView, ActivityLogsView, DeviceDNSLogsView, RouterSettingsView, ProxyIngestionView, ProxyLogsFeedView, ProxyStatsView

urlpatterns = [
    path('router-info/', RouterInfoView.as_view(), name='router-info'),
    path('devices/', ConnectedDevicesView.as_view(), name='devices'),
    path('stats/', NetworkStatsView.as_view(), name='stats'),
    path('activity/', ActivityLogsView.as_view(), name='activity'),
    path('devices/<int:device_id>/dns/', DeviceDNSLogsView.as_view(), name='device-dns'),
    path('settings/', RouterSettingsView.as_view(), name='settings'),
    path('proxy/ingest/', ProxyIngestionView.as_view(), name='proxy-ingest'),
    path('proxy/feed/', ProxyLogsFeedView.as_view(), name='proxy-feed'),
    path('proxy/stats/', ProxyStatsView.as_view(), name='proxy-stats'),
]
