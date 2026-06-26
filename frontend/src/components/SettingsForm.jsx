import React, { useState, useEffect } from 'react';
import { Settings, Save, Server, Shield, Key, Wifi, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { getSettings, saveSettings } from '../services/api';

const SettingsForm = () => {
  const [formData, setFormData] = useState({
    routerIp: '192.168.1.1',
    username: 'admin',
    password: 'admin',
    brand: 'Airtel',
    model: 'H660GM-A',
    snmpCommunity: 'public',
    apiEndpoint: '',
    apiToken: '',
    refreshInterval: '60',
    wifiSsid: 'Home_WiFi',
    wifiSsid5g: 'Home_WiFi_5G',
    wifiPassword: 'password123',
    wanMac: 'AA:BB:CC:DD:EE:FF',
    serialNumber: 'ROUTER12345678'
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSettings()
      .then(res => {
        if (res.data) {
          setFormData({
            routerIp: res.data.ip_address || '192.168.1.1',
            username: res.data.username || 'admin',
            password: res.data.password || 'admin',
            brand: res.data.brand || 'Airtel',
            model: res.data.model || 'H660GM-A',
            snmpCommunity: res.data.snmp_community || 'public',
            apiEndpoint: res.data.api_endpoint || '',
            apiToken: res.data.api_token || '',
            refreshInterval: res.data.refresh_interval || '60',
            wifiSsid: res.data.wifi_ssid || 'Home_WiFi',
            wifiSsid5g: res.data.wifi_ssid_5g || 'Home_WiFi_5G',
            wifiPassword: res.data.wifi_password || 'password123',
            wanMac: res.data.wan_mac || 'AA:BB:CC:DD:EE:FF',
            serialNumber: res.data.serial_number || 'ROUTER12345678'
          });
        }
      })
      .catch(err => {
        console.error("Failed to fetch settings from DB, loading local", err);
        const localData = localStorage.getItem('router_settings');
        if (localData) setFormData(JSON.parse(localData));
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem('router_settings', JSON.stringify(formData));
    setStatusMessage({ type: 'probing', text: `Probing active connection to ${formData.routerIp}...` });
    
    try {
      const res = await saveSettings({
        ip_address: formData.routerIp,
        username: formData.username,
        password: formData.password,
        brand: formData.brand,
        model: formData.model,
        snmp_community: formData.snmpCommunity,
        api_endpoint: formData.apiEndpoint,
        api_token: formData.apiToken,
        refresh_interval: parseInt(formData.refreshInterval) || 60,
        wifi_ssid: formData.wifiSsid,
        wifi_ssid_5g: formData.wifiSsid5g,
        wifi_password: formData.wifiPassword,
        wan_mac: formData.wanMac,
        serial_number: formData.serialNumber
      });
      setLoading(false);
      if (res.data?.connection_test) {
        setStatusMessage({
          type: res.data.connection_test.status,
          text: res.data.connection_test.message
        });
      } else {
        setStatusMessage({ type: 'success', text: 'Settings saved successfully!' });
      }
    } catch (err) {
      setLoading(false);
      console.error("Failed to save settings to DB", err);
      setStatusMessage({ type: 'danger', text: 'Failed to communicate with backend server.' });
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '1.5rem' }}>
      {/* Banner */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.025em' }}>
            Hardware Integration
          </h1>
          <p className="text-muted" style={{ fontSize: '0.88rem', margin: '0.15rem 0 0 0' }}>
            Configure driver credentials to connect your home router directly to the monitoring engine.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#eff6ff', padding: '0.45rem 1rem', borderRadius: '20px', border: '1px solid #bfdbfe' }}>
          <Wifi size={15} color="#2563eb" />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e40af' }}>Active Profile: {formData.brand}</span>
        </div>
      </div>

      {/* Floating Toast Popup Notification */}
      {statusMessage && (
        <div 
          style={{ 
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 999999,
            width: '360px',
            padding: '1rem 1.25rem', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '0.85rem',
            background: statusMessage.type === 'success' ? '#ecfdf5' : statusMessage.type === 'danger' ? '#fef2f2' : statusMessage.type === 'probing' ? '#eff6ff' : '#fffbeb',
            border: `1px solid ${statusMessage.type === 'success' ? '#6ee7b7' : statusMessage.type === 'danger' ? '#fca5a5' : statusMessage.type === 'probing' ? '#93c5fd' : '#fcd34d'}`,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
          }}
        >
          {statusMessage.type === 'success' && <CheckCircle2 size={22} color="#059669" style={{ flexShrink: 0, marginTop: '0.1rem' }} />}
          {statusMessage.type === 'warning' && <AlertTriangle size={22} color="#d97706" style={{ flexShrink: 0, marginTop: '0.1rem' }} />}
          {statusMessage.type === 'danger' && <XCircle size={22} color="#dc2626" style={{ flexShrink: 0, marginTop: '0.1rem' }} />}
          {statusMessage.type === 'probing' && <Loader2 size={22} color="#2563eb" className="animate-spin" style={{ flexShrink: 0, marginTop: '0.1rem' }} />}
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: statusMessage.type === 'success' ? '#065f46' : statusMessage.type === 'danger' ? '#991b1b' : statusMessage.type === 'probing' ? '#1e40af' : '#92400e' }}>
                {statusMessage.type === 'success' ? 'Connection Verified' : statusMessage.type === 'warning' ? 'Notice' : statusMessage.type === 'probing' ? 'Testing Hardware Link' : 'Notice'}
              </h4>
              <button onClick={() => setStatusMessage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#6b7280', fontSize: '1rem', lineHeight: 1 }}>×</button>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: statusMessage.type === 'success' ? '#047857' : statusMessage.type === 'danger' ? '#b91c1c' : statusMessage.type === 'probing' ? '#1d4ed8' : '#b45309', lineHeight: 1.4 }}>
              {statusMessage.text}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="dashboard-grid" style={{ gap: '1rem' }}>
          {/* Top-Left: Network Target */}
          <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', height: '100%', marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ padding: '0.4rem', borderRadius: '8px', background: '#eff6ff', color: '#2563eb' }}>
                  <Server size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Network Target Configuration</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Physical gateway & polling parameters</p>
                </div>
              </div>

              <div className="dashboard-grid" style={{ gap: '0.85rem' }}>
                <div className="col-span-6">
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.78rem', display: 'block' }}>Router Gateway IP</label>
                  <input type="text" name="routerIp" value={formData.routerIp} onChange={handleChange} className="form-input" placeholder="192.168.1.1" style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }} />
                </div>

                <div className="col-span-6">
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.78rem', display: 'block' }}>Polling Interval (s)</label>
                  <input type="number" name="refreshInterval" value={formData.refreshInterval} onChange={handleChange} className="form-input" placeholder="60" style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }} />
                </div>

                <div className="col-span-6">
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.78rem', display: 'block' }}>Vendor Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="form-input" placeholder="Airtel" style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }} />
                </div>

                <div className="col-span-6">
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.78rem', display: 'block' }}>Hardware Model</label>
                  <input type="text" name="model" value={formData.model} onChange={handleChange} className="form-input" placeholder="H660GM-A" style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Top-Right: Web Panel Authentication */}
          <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', height: '100%', marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ padding: '0.4rem', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a' }}>
                  <Shield size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Web Panel Authentication</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Router administration login credentials</p>
                </div>
              </div>

              <div className="dashboard-grid" style={{ gap: '0.85rem' }}>
                <div className="col-span-6">
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.78rem', display: 'block' }}>Admin Username</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-input" style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }} />
                </div>

                <div className="col-span-6">
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.78rem', display: 'block' }}>Admin Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-input" placeholder="••••••••" style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }} />
                </div>

                <div className="col-span-12">
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.78rem', display: 'block' }}>SNMP Read Community (Legacy)</label>
                  <input type="text" name="snmpCommunity" value={formData.snmpCommunity} onChange={handleChange} className="form-input" placeholder="public" style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Wireless & Hardware Identifiers */}
          <div className="col-span-12">
            <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ padding: '0.4rem', borderRadius: '8px', background: '#faf5ff', color: '#9333ea' }}>
                  <Wifi size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Wireless & Hardware Identifiers</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SSIDs, security key, MAC, and serial numbers</p>
                </div>
              </div>

              <div className="dashboard-grid" style={{ gap: '0.85rem' }}>
                <div className="col-span-4">
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.78rem', display: 'block' }}>WiFi 2.4G SSID</label>
                  <input type="text" name="wifiSsid" value={formData.wifiSsid || ''} onChange={handleChange} className="form-input" placeholder="Airtel Zerotouch" style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }} />
                </div>

                <div className="col-span-4">
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.78rem', display: 'block' }}>WiFi 5G SSID</label>
                  <input type="text" name="wifiSsid5g" value={formData.wifiSsid5g || ''} onChange={handleChange} className="form-input" placeholder="Airtel Zerotouch_5G" style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }} />
                </div>

                <div className="col-span-4">
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.78rem', display: 'block' }}>WiFi Password / Key</label>
                  <input type="text" name="wifiPassword" value={formData.wifiPassword || ''} onChange={handleChange} className="form-input" placeholder="Password" style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }} />
                </div>

                <div className="col-span-6">
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.78rem', display: 'block' }}>WAN MAC Address</label>
                  <input type="text" name="wanMac" value={formData.wanMac || ''} onChange={handleChange} className="form-input" placeholder="304F75B18991" style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem', fontFamily: 'monospace' }} />
                </div>

                <div className="col-span-6">
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.78rem', display: 'block' }}>Serial Number</label>
                  <input type="text" name="serialNumber" value={formData.serialNumber || ''} onChange={handleChange} className="form-input" placeholder="MR7R0VG661B7999" style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem', fontFamily: 'monospace' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Styled Submit Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '0.75rem 2.25rem', 
              fontSize: '0.95rem', 
              fontWeight: 600, 
              color: 'white', 
              background: loading ? '#93c5fd' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              border: '1px solid #047857', 
              borderRadius: '10px', 
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{loading ? 'Testing & Verifying Connection...' : 'Save & Verify Router Connection'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;
