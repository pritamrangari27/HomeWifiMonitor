from rest_framework import serializers
from .models import RouterConfig, ManagedDevice, ProxyLog

class RouterConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouterConfig
        fields = '__all__'

class ManagedDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagedDevice
        fields = '__all__'

class ProxyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProxyLog
        fields = '__all__'
