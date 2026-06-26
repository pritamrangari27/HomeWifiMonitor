import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

export const getRouterInfo = () => api.get('router-info/');
export const getConnectedDevices = () => api.get('devices/');
export const getNetworkStats = () => api.get('stats/');
export const getActivityLogs = () => api.get('activity/');
export const getDeviceDNSLogs = (deviceId) => api.get(`devices/${deviceId}/dns/`);
export const getSettings = () => api.get('settings/');
export const saveSettings = (data) => api.post('settings/', data);
export const getProxyFeed = (query = '', limit = 100) => api.get(`proxy/feed/?q=${encodeURIComponent(query)}&limit=${limit}`);
export const getProxyStats = () => api.get('proxy/stats/');

export default api;
