import React, { useState } from 'react';
import { Router as RouterIcon, Wifi, Globe, Activity, Key, Cpu, Hash, Eye, EyeOff, RefreshCw } from 'lucide-react';

const RouterCard = ({ info, onRefresh, refreshing }) => {
  const [showPw, setShowPw] = useState(false);
  if (!info) return null;

  return (
    <div className="card" style={{ padding: '1rem', marginBottom: 0 }}>
      <div className="flex justify-between items-center mb-2">
        <div className="card-title" style={{ marginBottom: 0 }}>
          <RouterIcon size={20} className="text-accent" />
          <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Router Information</h3>
        </div>
        {info.data_source && (
          <span className={`badge ${info.data_source.includes('Live') ? 'badge-success' : 'badge-warning'}`}>
            {info.data_source.replace('(Airtel Router Web Scrape)', '').replace('Router Web Scrape', '').trim()}
          </span>
        )}
      </div>
      <div className="dashboard-grid mt-2" style={{ gap: '1rem' }}>
        {/* Row 1: Hardware & Network Layer */}
        <div className="col-span-3 flex items-center gap-3">
          <Globe className="text-muted" size={18} />
          <div>
            <span className="form-label mb-0" style={{ marginBottom: 0, fontSize: '0.75rem' }}>Model</span>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>{info.router_model}</strong>
          </div>
        </div>
        <div className="col-span-3 flex items-center gap-3">
          <Activity className="text-muted" size={18} />
          <div>
            <span className="form-label mb-0" style={{ marginBottom: 0, fontSize: '0.75rem' }}>Gateway IP</span>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>{info.ip_address}</strong>
          </div>
        </div>
        <div className="col-span-3 flex items-center gap-3">
          <Cpu className="text-muted" size={18} />
          <div>
            <span className="form-label mb-0" style={{ marginBottom: 0, fontSize: '0.75rem' }}>WAN MAC</span>
            <strong style={{ fontSize: '0.85rem', display: 'block', fontFamily: 'monospace' }}>{info.wan_mac || 'AA:BB:CC:DD:EE:FF'}</strong>
          </div>
        </div>
        <div className="col-span-3 flex items-center gap-3">
          <RouterIcon className="text-muted" size={18} />
          <div>
            <span className="form-label mb-0" style={{ marginBottom: 0, fontSize: '0.75rem' }}>Firmware</span>
            <strong style={{ fontSize: '0.85rem', display: 'block' }}>{info.firmware_version}</strong>
          </div>
        </div>

        {/* Row 2: Wireless & Identifiers */}
        <div className="col-span-3 flex items-center gap-3">
          <Wifi className="text-accent" size={18} />
          <div>
            <span className="form-label mb-0" style={{ marginBottom: 0, fontSize: '0.75rem' }}>WiFi 2.4G SSID</span>
            <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-primary)' }}>{info.wifi_ssid}</strong>
          </div>
        </div>
        <div className="col-span-3 flex items-center gap-3">
          <Wifi className="text-accent" size={18} />
          <div>
            <span className="form-label mb-0" style={{ marginBottom: 0, fontSize: '0.75rem' }}>WiFi 5G SSID</span>
            <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-primary)' }}>{info.wifi_ssid_5g || 'Home_WiFi_5G'}</strong>
          </div>
        </div>
        <div className="col-span-3 flex items-center gap-3">
          <Key className="text-warning" size={18} />
          <div style={{ flex: 1 }}>
            <span className="form-label mb-0" style={{ marginBottom: 0, fontSize: '0.75rem' }}>WiFi Password</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <strong style={{ fontSize: '0.9rem', fontFamily: showPw ? 'monospace' : 'default' }}>
                {showPw ? (info.wifi_password || 'password123') : '••••••••••••'}
              </strong>
              <button 
                onClick={() => setShowPw(!showPw)} 
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-secondary)' }}
                title={showPw ? "Hide Password" : "Show Password"}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-3 flex items-center gap-3">
          <Hash className="text-muted" size={18} />
          <div>
            <span className="form-label mb-0" style={{ marginBottom: 0, fontSize: '0.75rem' }}>Serial Number</span>
            <strong style={{ fontSize: '0.85rem', display: 'block', fontFamily: 'monospace' }}>{info.serial_number || 'ROUTER12345678'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouterCard;
