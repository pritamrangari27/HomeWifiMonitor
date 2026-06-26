import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, RefreshCw, Search, ExternalLink, HardDrive, Lock, Server } from 'lucide-react';
import { getProxyFeed, getProxyStats } from '../services/api';

const ProxyDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [autoPoll, setAutoPoll] = useState(true);

  const fetchData = async () => {
    try {
      const [feedRes, statsRes] = await Promise.all([
        getProxyFeed(search, 80),
        getProxyStats()
      ]);
      setLogs(feedRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      console.error("Failed to fetch mitmproxy telemetry feed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (!autoPoll) return;
    const interval = setInterval(fetchData, 2500);
    return () => clearInterval(interval);
  }, [search, autoPoll]);

  const getMethodColor = (method) => {
    switch (method?.toUpperCase()) {
      case 'POST': return '#10b981';
      case 'PUT': return '#f59e0b';
      case 'DELETE': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const getStatusBadge = (code) => {
    if (code >= 200 && code < 300) return <span className="status-badge status-online">{code} OK</span>;
    if (code >= 400 && code < 500) return <span className="status-badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>{code}</span>;
    if (code >= 500) return <span className="status-badge status-offline">{code} ERR</span>;
    return <span className="status-badge">{code || 'PEND'}</span>;
  };

  return (
    <div className="proxy-dashboard" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--panel-bg)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: '0.75rem', borderRadius: '10px' }}>
            <ShieldAlert size={28} color="#3b82f6" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 700 }}>Mitmproxy HTTPS Interception Monitor</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Real-time decrypted full URL telemetry from managed Wi-Fi clients</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setAutoPoll(!autoPoll)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: autoPoll ? 'rgba(16, 185, 129, 0.15)' : 'var(--panel-bg)',
              color: autoPoll ? '#10b981' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Activity size={16} className={autoPoll ? "animate-pulse" : ""} />
            {autoPoll ? 'Live Stream: Active (2.5s)' : 'Live Stream: Paused'}
          </button>
          <button className="refresh-button" onClick={fetchData} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="stat-card" style={{ backgroundColor: 'var(--panel-bg)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <span>Total Requests Sniffed</span>
            <Server size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, marginTop: '0.5rem' }}>{stats?.total_requests ?? 0}</div>
        </div>
        <div className="stat-card" style={{ backgroundColor: 'var(--panel-bg)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <span>Total Bandwidth Intercepted</span>
            <HardDrive size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, marginTop: '0.5rem', color: '#10b981' }}>{stats?.total_bandwidth_formatted ?? '0 KB'}</div>
        </div>
        <div className="stat-card" style={{ backgroundColor: 'var(--panel-bg)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <span>Active Proxied Clients</span>
            <Lock size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, marginTop: '0.5rem', color: '#f59e0b' }}>{stats?.active_proxied_clients ?? 0}</div>
        </div>
      </div>

      {/* Main Feed Panel */}
      <div style={{ backgroundColor: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>Intercepted HTTPS Stream</h2>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search domain, URL, or device..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto', maxHeight: '560px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead style={{ backgroundColor: 'rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 5 }}>
              <tr>
                <th style={{ padding: '0.85rem 1.25rem' }}>Time</th>
                <th style={{ padding: '0.85rem 1rem' }}>Device</th>
                <th style={{ padding: '0.85rem 1rem' }}>Method</th>
                <th style={{ padding: '0.85rem 1rem' }}>Decrypted Domain</th>
                <th style={{ padding: '0.85rem 1rem' }}>Full URL</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Size</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-secondary)' }}>
                    <ShieldAlert size={42} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-color)' }}>No Intercepted HTTPS Requests Found</div>
                    <p style={{ fontSize: '0.84rem', maxWidth: '480px', margin: '0.5rem auto 0' }}>
                      To start sniffing full decrypted URLs, configure any managed Wi-Fi client device to use HTTP Proxy <strong>&lt;server-ip&gt;:8080</strong> and trust the generated mitmproxy root CA certificate.
                    </p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {log.timestamp?.split('T')[1]?.split('.')[0] || 'Live'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{log.device_name}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        backgroundColor: `${getMethodColor(log.http_method)}25`,
                        color: getMethodColor(log.http_method),
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }}>
                        {log.http_method}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--accent-color)' }}>{log.domain}</td>
                    <td style={{ padding: '0.75rem 1rem', maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a 
                        href={log.full_url || `https://${log.domain}`} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ color: 'var(--text-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        {log.full_url || `https://${log.domain}`}
                        <ExternalLink size={12} style={{ opacity: 0.5 }} />
                      </a>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{getStatusBadge(log.status_code)}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                      {log.response_bytes > 1024 ? `${round(log.response_bytes/1024)} KB` : `${log.response_bytes} B`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function round(val) {
  return Math.round(val * 10) / 10;
}

export default ProxyDashboard;
