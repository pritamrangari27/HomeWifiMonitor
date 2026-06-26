from abc import ABC, abstractmethod

class BaseRouterDriver(ABC):
    def __init__(self, config):
        self.config = config

    @abstractmethod
    def get_router_info(self):
        pass

    @abstractmethod
    def get_connected_devices(self):
        pass

    @abstractmethod
    def get_network_stats(self):
        pass

    @abstractmethod
    def get_activity_logs(self):
        pass

    @abstractmethod
    def get_dns_logs(self, device_id):
        pass
