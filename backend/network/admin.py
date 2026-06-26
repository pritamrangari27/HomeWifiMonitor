from django.contrib import admin
from .models import RouterConfig, ManagedDevice, ProxyLog

@admin.register(RouterConfig)
class RouterConfigAdmin(admin.ModelAdmin):
    list_display = ('brand', 'ip_address', 'wifi_ssid', 'updated_at')

@admin.register(ManagedDevice)
class ManagedDeviceAdmin(admin.ModelAdmin):
    list_display = ('device_name', 'ip_address', 'mac_address', 'is_proxy_trusted', 'created_at')

@admin.register(ProxyLog)
class ProxyLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'device_name', 'http_method', 'domain', 'status_code', 'response_bytes')
    list_filter = ('http_method', 'status_code')
    search_fields = ('domain', 'full_url', 'device_name')
