'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check for authentication
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    // In a real app, we would fetch user data from the backend here
    // For now, we'll simulate it
    setUser({ name: 'Staff Member', role: 'admin' });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  if (!user) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">Hotel M</Link>
        
        <nav className="nav-menu">
          <Link href="/dashboard" className="nav-item active">
            <span>🏠 Overview</span>
          </Link>
          <Link href="/dashboard/rooms" className="nav-item">
            <span>🔑 Rooms</span>
          </Link>
          <Link href="/dashboard/bookings" className="nav-item">
            <span>📅 Bookings</span>
          </Link>
          <Link href="/dashboard/guests" className="nav-item">
            <span>👥 Guests</span>
          </Link>
          <Link href="/dashboard/analytics" className="nav-item">
            <span>📊 Analytics</span>
          </Link>
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
            <p style={{ color: '#94a3b8' }}>Welcome back, {user.name}</p>
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
            <p className="stat-value">$12,450</p>
            <p className="stat-trend trend-up">↑ 12% from last month</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Room Occupancy</p>
            <p className="stat-value">84%</p>
            <p className="stat-trend trend-up">↑ 5% from yesterday</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">New Bookings</p>
            <p className="stat-value">24</p>
            <p className="stat-trend trend-down">↓ 2% from last week</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Pending Reviews</p>
            <p className="stat-value">12</p>
            <p className="stat-trend trend-up">↑ 3 new tonight</p>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="dash-grid">
          <section className="card">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <Link href="/dashboard/bookings" style={{ color: '#3b82f6', fontSize: '0.8rem', textDecoration: 'none' }}>View All</Link>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-info">
                  <h4>New Booking: Room 402</h4>
                  <p>John Doe • 3 nights • Premium Suite</p>
                </div>
                <span className="status-badge status-confirmed">Confirmed</span>
              </div>
              <div className="activity-item">
                <div className="activity-icon">🔑</div>
                <div className="activity-info">
                  <h4>Check-in: Room 105</h4>
                  <p>Sarah Wilson • Standard Double</p>
                </div>
                <span className="status-badge status-confirmed">Active</span>
              </div>
              <div className="activity-item">
                <div className="activity-icon">🧹</div>
                <div className="activity-info">
                  <h4>Housekeeping Required</h4>
                  <p>Room 214 • Departure clean requested</p>
                </div>
                <span className="status-badge status-pending">Pending</span>
              </div>
            </div>
          </section>

          <section className="card" style={{ background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)' }}>
            <div className="card-header">
              <h3>Room Status</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Available</span>
                <span style={{ fontWeight: '600' }}>42</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px' }}>
                <div style={{ width: '42%', height: '100%', background: '#3b82f6', borderRadius: '4px' }}></div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <span style={{ color: '#94a3b8' }}>Occupied</span>
                <span style={{ fontWeight: '600' }}>84</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px' }}>
                <div style={{ width: '84%', height: '100%', background: '#22c55e', borderRadius: '4px' }}></div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <span style={{ color: '#94a3b8' }}>Cleaning</span>
                <span style={{ fontWeight: '600' }}>12</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px' }}>
                <div style={{ width: '12%', height: '100%', background: '#eab308', borderRadius: '4px' }}></div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
