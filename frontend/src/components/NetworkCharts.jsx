import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';
import { Activity } from 'lucide-react';

const NetworkCharts = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="card mt-4">
      <div className="card-title">
        <Activity size={24} className="text-accent" />
        <h3>Network Usage</h3>
      </div>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={stats.traffic_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="download" name="Download (Mbps)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDownload)" />
            <Area type="monotone" dataKey="upload" name="Upload (Mbps)" stroke="#10b981" fillOpacity={1} fill="url(#colorUpload)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NetworkCharts;
