'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../dashboard.css';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hotelm-backend-final.onrender.com';

  const fetchData = async () => {
    try {
      const statsRes = await fetch(`${API_URL}/api/stats`);
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }
    fetchData();
  }, [router]);

  if (loading) return <div className="dashboard-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p>Loading Admin Controls...</p>
  </div>;

  return (
    <div className="dashboard-layout">
      {/* Sidebar - Reusing styles from dashboard */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">Hotel M</Link>
        <nav className="nav-menu">
          <Link href="/dashboard" className="nav-item"><span>🏠 Overview</span></Link>
          <Link href="/dashboard/rooms" className="nav-item"><span>🔑 Rooms</span></Link>
          <Link href="/dashboard/bookings" className="nav-item"><span>📅 Bookings</span></Link>
          <Link href="/dashboard/guests" className="nav-item"><span>👥 Guests</span></Link>
          <Link href="/dashboard/analytics" className="nav-item"><span>📊 Analytics</span></Link>
        </nav>
        <div className="sidebar-footer">
          <Link href="/dashboard" className="nav-item"><span>← Back to Dashboard</span></Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dash-header">
          <div>
            <h1>Admin Control Panel</h1>
            <p style={{ color: '#94a3b8' }}>System-wide management and maintenance</p>
          </div>
          <div className="user-profile" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: '#3b82f6' }}>
            <div className="avatar">AD</div>
            <span>Admin</span>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* System Health */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>System Health</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Database Status</span>
                <span style={{ color: '#22c55e' }}>● Operational</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>API Gateway</span>
                <span style={{ color: '#22c55e' }}>● Stable</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Storage (S3)</span>
                <span style={{ color: '#22c55e' }}>● Connected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>SSL Certificate</span>
                <span style={{ color: '#22c55e' }}>● Valid</span>
              </div>
            </div>
            
            <div style={{ marginTop: '2.5rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' }}>Administrative Tools</h4>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <button className="btn" style={{ width: '100%', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Clear System Cache</button>
                <button className="btn" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)' }}>Generate Report</button>
              </div>
            </div>
          </div>

          {/* User & Staff Management */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>System Overview</h3>
            
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '2rem' }}>
              <div className="stat-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <p className="stat-label">System Uptime</p>
                <p className="stat-value" style={{ fontSize: '1.5rem' }}>99.9%</p>
              </div>
              <div className="stat-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <p className="stat-label">Total Staff</p>
                <p className="stat-value" style={{ fontSize: '1.5rem' }}>8</p>
              </div>
            </div>

            <h4 style={{ marginBottom: '1rem', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' }}>Recent System Log</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody style={{ fontSize: '0.85rem' }}>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem 0', color: '#94a3b8' }}>13:45:22</td>
                    <td style={{ padding: '0.75rem' }}>Rooms updated to 'available'</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}><span style={{ color: '#22c55e' }}>Success</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem 0', color: '#94a3b8' }}>13:42:10</td>
                    <td style={{ padding: '0.75rem' }}>Database cleanup initialized</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}><span style={{ color: '#22c55e' }}>Success</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem 0', color: '#94a3b8' }}>12:30:15</td>
                    <td style={{ padding: '0.75rem' }}>Staff "Receptionist_1" logged in</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}><span style={{ color: '#94a3b8' }}>Info</span></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem 0', color: '#94a3b8' }}>10:15:00</td>
                    <td style={{ padding: '0.75rem' }}>Automated backup complete</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}><span style={{ color: '#22c55e' }}>Success</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
