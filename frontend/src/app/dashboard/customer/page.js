'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../dashboard.css';

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, points: 1250 });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    try {
      // Fetch Bookings
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

      // Fetch Profile
      const profileRes = await fetch(`${API_URL}/api/customer/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
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
        <Link href="/" className="sidebar-logo">
          <span style={{ color: '#fff' }}>Hotel</span><span style={{ color: 'var(--color-accent)' }}>M</span>
        </Link>
        <nav className="nav-menu">
          <Link href="/dashboard/customer" className="nav-item active">
            <span className="nav-icon">🏠</span>
            <span>Overview</span>
          </Link>
          <Link href="/dashboard/customer/bookings" className="nav-item">
            <span className="nav-icon">📅</span>
            <span>My Bookings</span>
          </Link>
          <Link href="/dashboard/customer/book" className="nav-item">
            <span className="nav-icon">🗝️</span>
            <span>Book a Room</span>
          </Link>
          <Link href="/explore" className="nav-item">
            <span className="nav-icon">✨</span>
            <span>Explore Luxury</span>
          </Link>
          <Link href="/profile" className="nav-item" style={{ marginTop: 'auto' }}>
            <span className="nav-icon">👤</span>
            <span>Profile Settings</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', color: '#ef4444' }}>
            <span className="nav-icon">🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dash-header">
          <div>
            <h1 style={{ marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Welcome back, {profile ? profile.first_name : 'Guest'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Your luxury stay experience starts here.</p>
          </div>
          <div className="user-profile">
            <div className="avatar" style={{ 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary))',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
            }}>
              {profile ? `${profile.first_name[0]}${profile.last_name[0]}` : 'VG'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{profile ? `${profile.first_name} ${profile.last_name}` : 'Valued Guest'}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase' }}>Gold Member</span>
            </div>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💎</span>
              <span className="stat-trend trend-up">+12%</span>
            </div>
            <p className="stat-label">Loyalty Points</p>
            <p className="stat-value">{stats.points}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>250 to next tier</p>
          </div>
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🛌</span>
              <span className="stat-trend trend-up">Active</span>
            </div>
            <p className="stat-label">Successful Stays</p>
            <p className="stat-value">{stats.total}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lifetime visits</p>
          </div>
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🌟</span>
              <span style={{ color: 'var(--color-accent)', fontSize: '0.75rem', fontWeight: 700 }}>SOON</span>
            </div>
            <p className="stat-label">Upcoming Stays</p>
            <p className="stat-value" style={{ color: 'var(--color-accent)' }}>{stats.active}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>View details →</p>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.05))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎁</span>
            </div>
            <p className="stat-label">Rewards Earned</p>
            <p className="stat-value" style={{ color: 'var(--color-accent-secondary)' }}>4</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Redeem points</p>
          </div>
        </div>

        {/* Premium Banner */}
        <div className="card" style={{ 
          marginBottom: '2rem', 
          background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.4))',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--color-accent)', filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none' }}></div>
          <div style={{ zIndex: 1 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Experience the Uncharted</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '500px' }}>Our new Penthouse suites are now available. Use your Gold Member points for a 20% discount on your next luxury escape.</p>
            <Link href="/dashboard/customer/book" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Book Now</Link>
          </div>
          <div style={{ zIndex: 1, textAlign: 'right', display: 'none' }}>
            {/* Image holder for future */}
          </div>
        </div>

        {/* Dash Grid */}
        <div className="dash-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
          {/* Recent Bookings */}
          <section className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Stays</h3>
              <Link href="/dashboard/customer/bookings" style={{ color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>View History →</Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '1.25rem 1rem', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>ID</th>
                    <th style={{ padding: '1.25rem 1rem', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Accomodation</th>
                    <th style={{ padding: '1.25rem 1rem', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</th>
                    <th style={{ padding: '1.25rem 1rem', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.3s ease' }} className="table-row-hover">
                      <td style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: 700 }}>#BK-{b.id}</td>
                      <td style={{ padding: '1.25rem 1rem', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>Luxury Room</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Room #{b.room?.room_number}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{b.check_in_date}</td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <span style={{ 
                          padding: '0.35rem 0.8rem', 
                          borderRadius: '8px', 
                          fontSize: '0.7rem', 
                          fontWeight: 700, 
                          textTransform: 'uppercase',
                          background: b.status === 'confirmed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
                          color: b.status === 'confirmed' ? '#22c55e' : 'var(--text-muted)',
                          border: `1px solid ${b.status === 'confirmed' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`
                        }}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📭</div>
                        <p>No reservations found. Start your journey today.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Actions & Status */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 700 }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link href="/dashboard/customer/book" className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none', padding: '1rem' }}>New Booking</Link>
                <Link href="/dashboard/customer/bookings" className="btn" style={{ 
                  textAlign: 'center', 
                  textDecoration: 'none', 
                  padding: '1rem', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--glass-border)',
                  color: '#fff'
                }}>My Stays</Link>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 700 }}>Service Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Digital Concierge</span>
                  <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 700 }}>● ACTIVE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Room Service</span>
                  <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 700 }}>● AVAILABLE</span>
                </div>
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>Last updated: {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <style jsx>{`
        .nav-icon {
          font-size: 1.25rem;
          margin-right: 0.75rem;
        }
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </div>
  );
}
