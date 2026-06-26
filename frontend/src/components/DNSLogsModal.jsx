import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Globe, RefreshCw } from 'lucide-react';
import { getDeviceDNSLogs } from '../services/api';

const DNSLogsModal = ({ device, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const deviceId = device?.id;

  const loadLogs = () => {
    if (deviceId) {
      getDeviceDNSLogs(deviceId)
        .then(res => {
          setLogs(res.data);
          setLoading(false);
          setRefreshing(false);
        })
        .catch(err => {
          console.error("Failed to load DNS logs", err);
          setLogs([]);
          setLoading(false);
          setRefreshing(false);
        });
    }
  };

  useEffect(() => {
    loadLogs();
  }, [deviceId]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadLogs();
  };

  if (!device) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '750px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--panel-bg)', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)' }}>
        <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex items-center gap-2">
            <Globe className="text-accent" size={24} />
            <h3 style={{ margin: 0 }}>Browsing History: {device.device_name}</h3>
          </div>
          <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              className="btn btn-sm" 
              onClick={handleRefresh} 
              disabled={refreshing}
              title="Refresh Logs"
              style={{ padding: '0.4rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '6px', display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--text-color)' }}
            >
              <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
            </button>
            <button className="btn-close" onClick={onClose} style={{ padding: '0.4rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-color)', display: 'flex', alignItems: 'center' }}>
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="modal-body" style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading logs...</div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', fontSize: '1.15rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              No browsing history recorded for this device yet.
            </div>
          ) : (
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Visited Link</th>
                  <th>Resolved IP</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td className="text-muted">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a 
                        href={log.url || `https://${log.domain}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 500 }}
                      >
                        {log.url || log.domain}
                      </a>
                    </td>
                    <td className="text-muted">{log.ip_resolved}</td>
                    <td>
                      <span className={`badge ${log.status === 'Resolved' ? 'badge-success' : 'badge-danger'}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DNSLogsModal;
