import React, { useState } from 'react';
import { Search, Filter, MonitorSmartphone, Eye, RefreshCw } from 'lucide-react';
import DNSLogsModal from './DNSLogsModal';

const DeviceTable = ({ devices = [], onRefresh, refreshing }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  
  const filteredDevices = devices.filter(d => 
    d.device_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.ip_address.includes(searchTerm)
  );

  return (
    <div className="card" style={{ padding: '1rem', marginBottom: 0 }}>
      <div className="flex justify-between items-center mb-2">
        <div className="card-title" style={{ marginBottom: 0 }}>
          <MonitorSmartphone size={20} className="text-accent" />
          <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Connected Devices</h3>
        </div>
        <div className="flex items-center" style={{ gap: '0.85rem' }}>
          {onRefresh && (
            <button 
              className="btn btn-sm" 
              onClick={onRefresh} 
              disabled={refreshing}
              style={{ padding: '0.4rem', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', cursor: 'pointer', color: '#374151' }}
              title="Refresh Connected Devices"
            >
              <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            </button>
          )}
          <div style={{ position: 'relative' }}>
            <Search size={18} className="text-muted" style={{ position: 'absolute', left: 10, top: 10 }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search devices..." 
              style={{ paddingLeft: '2.5rem', width: '220px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="table-container" style={{ maxHeight: '240px', overflowY: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Device Name</th>
              <th>IP Address</th>
              <th>MAC Address</th>
              <th>Connection</th>
              <th>Status</th>
              <th>Data Usage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map(device => (
              <tr key={device.id}>
                <td style={{ fontWeight: 500 }}>{device.device_name}</td>
                <td className="text-muted">{device.ip_address}</td>
                <td className="text-muted">{device.mac_address}</td>
                <td>
                  <span className={`badge ${device.connection_type === 'Wi-Fi' ? 'badge-neutral' : 'badge-success'}`}>
                    {device.connection_type}
                  </span>
                </td>
                <td>
                  <span className={`badge ${device.status?.includes('Online') ? 'badge-success' : 'badge-danger'}`}>
                    {device.status}
                  </span>
                </td>
                <td className="text-muted">{device.data_usage}</td>
                <td>
                  <button 
                    className="btn" 
                    style={{ padding: '0.25rem 0.5rem', background: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <Eye size={16} /> Logs
                  </button>
                </td>
              </tr>
            ))}
            {filteredDevices.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No devices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedDevice && (
        <DNSLogsModal device={selectedDevice} onClose={() => setSelectedDevice(null)} />
      )}
    </div>
  );
};

export default DeviceTable;
