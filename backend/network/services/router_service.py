from ..models import RouterConfig
from .drivers.mock_driver import MockRouterDriver
from .drivers.airtel_driver import AirtelRouterDriver

class RouterService:
    @staticmethod
    def _get_driver():
        try:
            config = RouterConfig.get_solo()
        except Exception:
            class DummyConfig:
                ip_address = "192.168.1.1"
                brand = "Airtel"
                model = "ZXHN F670L"
            config = DummyConfig()

        # Active hardware integration using live network scraper
        if any(keyword in config.brand.lower() for keyword in ["airtel", "zte", "nokia", "huawei", "fiber"]):
            return AirtelRouterDriver(config)

        # Default fallback to Mock driver
        return MockRouterDriver(config)

    @staticmethod
    def get_router_info():
        return RouterService._get_driver().get_router_info()

    @staticmethod
    def get_connected_devices():
        return RouterService._get_driver().get_connected_devices()

    @staticmethod
    def get_network_stats():
        return RouterService._get_driver().get_network_stats()

    @staticmethod
    def get_activity_logs():
        return RouterService._get_driver().get_activity_logs()

    @staticmethod
    def get_dns_logs(device_id):
        return RouterService._get_driver().get_dns_logs(device_id)
