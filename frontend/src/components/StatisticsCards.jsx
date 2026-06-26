import React from 'react';
import { Smartphone, Laptop, Wifi, Network } from 'lucide-react';

const StatisticsCards = ({ devices, stats }) => {
  const onlineDevices = devices?.filter(d => d.status?.includes('Online')).length || 0;
  const totalBandwidth = stats?.total_bandwidth || { download: '0 TB', upload: '0 TB' };

  return (
    <div className="dashboard-grid">
      <div className="col-span-4">
        <div className="card stat-card mb-0">
          <div className="stat-icon">
            <Smartphone size={24} />
          </div>
          <div className="stat-info">
            <h4>Connected Devices</h4>
            <p>{onlineDevices} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ {devices?.length || 0}</span></p>
          </div>
        </div>
      </div>
      
      <div className="col-span-4">
        <div className="card stat-card mb-0">
          <div className="stat-icon">
            <Network size={24} />
          </div>
          <div className="stat-info">
            <h4>Download Traffic</h4>
            <p>{totalBandwidth.download}</p>
          </div>
        </div>
      </div>
      
      <div className="col-span-4">
        <div className="card stat-card mb-0">
          <div className="stat-icon">
            <Wifi size={24} />
          </div>
          <div className="stat-info">
            <h4>Upload Traffic</h4>
            <p>{totalBandwidth.upload}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCards;
