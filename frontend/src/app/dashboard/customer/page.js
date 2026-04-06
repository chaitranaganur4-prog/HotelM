'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../dashboard.css';

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, points: 1250 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hotelm-backend-erid.onrender.com';

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/customer/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.slice(0, 5));
        setStats(prev => ({
          ...prev,
          total: data.length,
          active: data.filter(b => b.status === 'confirmed' || b.status === 'checked_in').length
        }));
      }
    } catch (err) {
      console.error("Failed to fetch customer data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push('/signin');
  };

  if (loading) return <div className="dashboard-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p>Loading your experience...</p>
  </div>;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">Hotel M</Link>
        <nav className="nav-menu">
          <Link href="/dashboard/customer" className="nav-item active"><span>🏠 Overview</span></Link>
          <Link href="/dashboard/customer/bookings" className="nav-item"><span>📅 My Bookings</span></Link>
          <Link href="/dashboard/customer/book" className="nav-item"><span>🗝️ Book a Room</span></Link>
          <Link href="/profile" className="nav-item"><span>👤 Profile</span></Link>
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
            <h1>Dashboard Overview</h1>
            <p style={{ color: '#94a3b8' }}>Welcome back to your premium portal</p>
          </div>
          <div className="user-profile">
            <div className="avatar">VG</div>
            <span>Valued Guest</span>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Loyalty Points</p>
            <p className="stat-value">{stats.points}</p>
            <p className="stat-trend trend-up">Gold Status</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">My Reservations</p>
            <p className="stat-value">{stats.total}</p>
            <p className="stat-trend trend-up">Lifetime stays</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Active Stays</p>
            <p className="stat-value" style={{ color: '#3b82f6' }}>{stats.active}</p>
            <p className="stat-trend" style={{ color: '#94a3b8' }}>Currently booked</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Next Reward</p>
            <p className="stat-value" style={{ color: '#8b5cf6' }}>250</p>
            <p className="stat-trend" style={{ color: '#94a3b8' }}>Points needed</p>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <Link href="/dashboard/customer/book" className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>Book a New Stay</Link>
              <Link href="/dashboard/customer/bookings" className="btn" style={{ textAlign: 'center', textDecoration: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>My Reservations</Link>
            </div>
          </div>
          
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Stay Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Concierge API</span>
                <span style={{ color: '#22c55e', fontWeight: 600 }}>● Online</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Booking Server</span>
                <span style={{ color: '#22c55e', fontWeight: 600 }}>● Online</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Last Updated</span>
                <span style={{ color: '#94a3b8' }}>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Bookings */}
        <div className="card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
          <div className="card-header" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Recent Stays</h3>
            <Link href="/dashboard/customer/bookings" style={{ fontSize: '0.85rem', color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Reference</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Room</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Check-In</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#3b82f6', fontWeight: 600 }}>BK-{b.id}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>#{b.room?.room_number}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>{b.check_in_date}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: 100, 
                        fontSize: '0.7rem', 
                        fontWeight: 600, 
                        background: b.status === 'confirmed' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.05)', 
                        color: b.status === 'confirmed' ? '#3b82f6' : '#94a3b8' 
                      }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No recent activity to show.</td>
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
