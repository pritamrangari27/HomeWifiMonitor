import React from 'react';
import { Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const title = location.pathname === '/settings' ? 'Router Integration Settings' : 'Network Overview';

  return (
    <div className="navbar">
      <div>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <Bell size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={16} color="#6b7280" />
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Admin</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
