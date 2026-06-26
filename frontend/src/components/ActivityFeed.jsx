import React from 'react';
import { History, ShieldAlert, Wifi, Power, RefreshCw } from 'lucide-react';

const getIconForEvent = (event) => {
  if (event.includes('device')) return <Wifi size={16} />;
  if (event.includes('alert')) return <ShieldAlert size={16} />;
  if (event.includes('restart')) return <Power size={16} />;
  return <History size={16} />;
};

const ActivityFeed = ({ logs = [], onRefresh, refreshing }) => {
  return (
    <div className="card" style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column', maxHeight: '280px', marginBottom: 0 }}>
      <div className="flex justify-between items-center mb-2" style={{ flexShrink: 0 }}>
        <div className="card-title" style={{ marginBottom: 0 }}>
          <History size={18} className="text-accent" />
          <h3 style={{ fontSize: '1rem', margin: 0 }}>Recent Activity</h3>
        </div>
        {onRefresh && (
          <button 
            className="btn btn-sm" 
            onClick={onRefresh} 
            disabled={refreshing}
            style={{ padding: '0.35rem', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', cursor: 'pointer', color: '#374151' }}
            title="Refresh Activity Feed"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          </button>
        )}
      </div>
      
      <ul className="activity-list" style={{ overflowY: 'auto', flex: 1, margin: 0, padding: 0, listStyle: 'none', paddingRight: '0.4rem' }}>
        {logs.map((log) => (
          <li key={log.id} className="activity-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', padding: '0.65rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div className="activity-icon" style={{ marginTop: '0.1rem', flexShrink: 0 }}>
              {getIconForEvent(log.event.toLowerCase())}
            </div>
            <div className="activity-content flex-1" style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.event}</h4>
                <span className="activity-time" style={{ fontSize: '0.72rem', color: '#9ca3af', flexShrink: 0 }}>
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{log.details}</p>
            </div>
          </li>
        ))}
        {logs.length === 0 && (
          <li style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
            No recent activity
          </li>
        )}
      </ul>
    </div>
  );
};

export default ActivityFeed;
