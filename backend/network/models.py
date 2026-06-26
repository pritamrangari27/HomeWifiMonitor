from django.db import models

class RouterConfig(models.Model):
    ip_address = models.CharField(max_length=50, default='192.168.1.1')
    username = models.CharField(max_length=100, default='admin')
    password = models.CharField(max_length=100, blank=True, default='admin')
    brand = models.CharField(max_length=100, default='Airtel')
    model = models.CharField(max_length=100, blank=True, default='H660GM-A')
    snmp_community = models.CharField(max_length=100, default='public')
    api_endpoint = models.CharField(max_length=255, blank=True, default='')
    api_token = models.CharField(max_length=255, blank=True, default='')
    refresh_interval = models.IntegerField(default=60)
    serial_number = models.CharField(max_length=100, blank=True, default='ROUTER12345678')
    wan_mac = models.CharField(max_length=100, blank=True, default='AA:BB:CC:DD:EE:FF')
    wifi_ssid = models.CharField(max_length=100, blank=True, default='Home_WiFi')
    wifi_ssid_5g = models.CharField(max_length=100, blank=True, default='Home_WiFi_5G')
    wifi_password = models.CharField(max_length=100, blank=True, default='password123')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.brand} ({self.ip_address})"

    @classmethod
    def get_solo(cls):
        obj, created = cls.objects.get_or_create(id=1)
        if not obj.wifi_ssid or obj.wifi_ssid in ['Home_WiFi', 'Airtel Zerotouch']:
            obj.model = 'H660GM-A'
            obj.password = 'admin'
            obj.serial_number = 'ROUTER12345678'
            obj.wan_mac = 'AA:BB:CC:DD:EE:FF'
            obj.wifi_ssid = 'Home_WiFi'
            obj.wifi_ssid_5g = 'Home_WiFi_5G'
            obj.wifi_password = 'password123'
            obj.save()
        return obj

class ManagedDevice(models.Model):
    device_name = models.CharField(max_length=150, default='Unknown Device')
    ip_address = models.CharField(max_length=50)
    mac_address = models.CharField(max_length=50, unique=True)
    is_proxy_trusted = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.device_name} ({self.mac_address})"

class ProxyLog(models.Model):
    device_name = models.CharField(max_length=150, default='Managed Device')
    ip_address = models.CharField(max_length=50)
    mac_address = models.CharField(max_length=50, db_index=True)
    timestamp = models.DateTimeField(db_index=True)
    http_method = models.CharField(max_length=10)
    domain = models.CharField(max_length=255, db_index=True)
    full_url = models.TextField()
    status_code = models.IntegerField(default=200)
    response_bytes = models.IntegerField(default=0)
    content_type = models.CharField(max_length=100, blank=True, default='')

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.http_method} {self.domain} ({self.status_code})"
