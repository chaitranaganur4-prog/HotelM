'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './dashboard.css';

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hotelm-backend-erid.onrender.com';

  const fetchData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/api/stats`),
        fetch(`${API_URL}/api/bookings/`)
      ]);
      
      if (statsRes.ok) setStats(await statsRes.json());
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setBookings(data.slice(0, 5)); // Only latest 5
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  if (loading) return <div className="dashboard-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p>Loading Dashboard Stats...</p>
  </div>;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">Hotel M</Link>
        <nav className="nav-menu">
          <Link href="/dashboard" className="nav-item active"><span>🏠 Overview</span></Link>
          <Link href="/dashboard/rooms" className="nav-item"><span>🔑 Rooms</span></Link>
          <Link href="/dashboard/bookings" className="nav-item"><span>📅 Bookings</span></Link>
          <Link href="/dashboard/guests" className="nav-item"><span>👥 Guests</span></Link>
          <Link href="/dashboard/analytics" className="nav-item"><span>📊 Analytics</span></Link>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
            <span>🚪 Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dash-header">
          <div>
            <h1>Staff Dashboard</h1>
            <p style={{ color: '#94a3b8' }}>Welcome back, Admin</p>
          </div>
          <div className="user-profile">
            <div className="avatar">AD</div>
            <span>Admin</span>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">${stats?.revenue_stats?.total?.toLocaleString() || 0}</p>
            <p className="stat-trend trend-up">Current earnings</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Room Occupancy</p>
            <p className="stat-value">{stats?.room_stats?.occupancy_rate || 0}%</p>
            <p className="stat-trend trend-up">{stats?.room_stats?.occupied} / {stats?.room_stats?.total} rooms</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Guest Count</p>
            <p className="stat-value">{stats?.guest_stats?.total || 0}</p>
            <p className="stat-trend trend-up">Active registrations</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Bookings</p>
            <p className="stat-value">{stats?.booking_stats?.total || 0}</p>
            <p className="stat-trend trend-up">Lifetime records</p>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <Link href="/dashboard/rooms" className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>Book a Room</Link>
              <Link href="/dashboard/bookings" className="btn" style={{ textAlign: 'center', textDecoration: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>View All Bookings</Link>
            </div>
          </div>
          
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>System Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Database</span>
                <span style={{ color: '#22c55e', fontWeight: 600 }}>● Online</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>API Server</span>
                <span style={{ color: '#22c55e', fontWeight: 600 }}>● Online</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Last Sync</span>
                <span style={{ color: '#94a3b8' }}>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
          <div className="card-header" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Recent Bookings</h3>
            <Link href="/dashboard/bookings" style={{ fontSize: '0.85rem', color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Guest</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Room</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Check-In</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>BK-{b.id}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{b.guest?.first_name} {b.guest?.last_name}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>#{b.room?.room_number}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>{b.check_in_date}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>{b.status}</span>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No recent activity to show.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
