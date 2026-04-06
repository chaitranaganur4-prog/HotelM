'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../dashboard.css';

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hotelm-backend-erid.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (!token || role !== 'customer') {
      router.push('/signin');
      return;
    }

    // Mocking user profile data for now
    setUser({
      name: 'Valued Guest',
      points: 1250,
      tier: 'Gold'
    });
    setLoading(false);
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
            <h1>Welcome back, {user?.name}</h1>
            <p style={{ color: '#94a3b8' }}>Your premium stay starts here</p>
          </div>
          <div className="user-profile">
            <div className="avatar">VG</div>
            <span>Guest Portal</span>
          </div>
        </header>

        {/* Stats / Loyalty */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="stat-card">
            <p className="stat-label">Loyalty Points</p>
            <p className="stat-value">{user?.points}</p>
            <p className="stat-trend trend-up">★ {user?.tier} Member</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Active Bookings</p>
            <p className="stat-value">1</p>
            <p className="stat-trend">Upcoming stay in 3 days</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Member Since</p>
            <p className="stat-value">2026</p>
            <p className="stat-trend" style={{ color: '#94a3b8' }}>Exclusive perks active</p>
          </div>
        </div>

        <div className="dash-grid">
          <div className="card">
            <div className="card-header">
              <h3>Upcoming Stays</h3>
              <Link href="/dashboard/customer/bookings" style={{ color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600 }}>View All</Link>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">🏨</div>
                <div className="activity-info">
                  <h4>Luxury Suite #305</h4>
                  <p>April 15 - April 18, 2026</p>
                </div>
                <div className="status-badge status-confirmed">Confirmed</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
             <h3>Special Offer</h3>
             <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '1rem 0 1.5rem' }}>Get 20% off on spa services during your next stay!</p>
             <Link href="/dashboard/customer/book" className="btn btn-primary" style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>Book Another Stay</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
