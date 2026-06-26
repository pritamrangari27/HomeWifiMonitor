import React, { useEffect, useState, useCallback, useRef } from 'react';
import RouterCard from './RouterCard';
import StatisticsCards from './StatisticsCards';
import DeviceTable from './DeviceTable';
import ActivityFeed from './ActivityFeed';
import { getRouterInfo, getConnectedDevices, getNetworkStats, getActivityLogs } from '../services/api';
import { Loader2, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const prevLogsRef = useRef(null);

  const [data, setData] = useState({
    routerInfo: null,
    devices: [],
    stats: null,
    activity: []
  });

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const [routerRes, devicesRes, statsRes, activityRes] = await Promise.all([
        getRouterInfo(),
        getConnectedDevices(),
        getNetworkStats(),
        getActivityLogs()
      ]);
      
      const incomingLogs = activityRes.data || [];
      const currentLogKeys = new Set(incomingLogs.map(l => l.event + l.timestamp));
      
      if (prevLogsRef.current) {
        incomingLogs.forEach(l => {
          const logKey = l.event + l.timestamp;
          if (!prevLogsRef.current.has(logKey)) {
            if (l.event.includes('connected') || l.event.includes('disconnected')) {
              const cleanMsg = l.event.replace('(alert)', '').replace('(device)', '').trim();
              setToastMessage(cleanMsg);
            }
          }
        });
      }
      prevLogsRef.current = currentLogKeys;

      setData({
        routerInfo: routerRes.data,
        devices: devicesRes.data || [],
        stats: statsRes.data,
        activity: incomingLogs
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData(true); // silent ultra-fast 2s real-time background poll
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <Loader2 className="text-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="dashboard-grid" style={{ gap: '1rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '1rem' }}>
      <div className="col-span-12 flex justify-between items-center mb-1">
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>Network Overview</h2>
        <button 
          className="btn btn-primary flex items-center" 
          onClick={() => fetchData(false)}
          disabled={refreshing}
          style={{ padding: '0.5rem 1.15rem', fontSize: '0.88rem', borderRadius: '8px', gap: '0.65rem' }}
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          <span>{refreshing ? "Refreshing..." : "Refresh Dashboard"}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="col-span-12">
        <StatisticsCards devices={data.devices} stats={data.stats} />
      </div>
      
      {/* Router Information Full Width (100% wide, zero squishing) */}
      <div className="col-span-12">
        <RouterCard info={data.routerInfo} onRefresh={() => fetchData(false)} refreshing={refreshing} />
      </div>
      
      {/* Bottom Row: Connected Devices Table (Left) & Recent Activity (Right) */}
      <div className="col-span-8">
        <DeviceTable devices={data.devices} onRefresh={() => fetchData(false)} refreshing={refreshing} />
      </div>

      <div className="col-span-4">
        <ActivityFeed logs={data.activity} onRefresh={() => fetchData(false)} refreshing={refreshing} />
      </div>

      {/* Live Floating Popup Notification Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: '#065f46',
          color: '#ffffff',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(6, 95, 70, 0.4)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.95rem',
          fontWeight: 600
        }}>
          <span style={{ fontSize: '1.25rem' }}>🔔</span>
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: '#a7f3d0', cursor: 'pointer', marginLeft: '0.5rem', fontSize: '1.1rem' }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
