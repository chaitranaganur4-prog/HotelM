'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../dashboard.css';

const STATUS_STYLE = {
  confirmed:   { bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6', label: 'Confirmed' },
  checked_in:  { bg: 'rgba(34,197,94,0.12)',   color: '#22c55e', label: 'Checked In' },
  checked_out: { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', label: 'Checked Out' },
  cancelled:   { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444', label: 'Cancelled' },
};

const PAYMENT_STYLE = {
  pending:  { bg: 'rgba(234,179,8,0.1)',   color: '#eab308' },
  paid:     { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e' },
};

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hotelm-backend-erid.onrender.com';

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/signin');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/customer/bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch bookings');
        
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router, API_URL]);

  const filtered = bookings.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'pending') return b.payment_status === 'pending';
    return b.status === filter;
  });

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in').length,
    spent: bookings.filter(b => b.payment_status === 'paid').reduce((acc, b) => acc + parseFloat(b.total_amount), 0)
  };

  if (loading) return (
    <div className="dashboard-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>Syncing your reservations...</p>
    </div>
  );

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">
          <span style={{ color: '#fff' }}>Hotel</span><span style={{ color: 'var(--color-accent)' }}>M</span>
        </Link>
        <nav className="nav-menu">
          <Link href="/dashboard/customer" className="nav-item">
            <span className="nav-icon">🏠</span>
            <span>Overview</span>
          </Link>
          <Link href="/dashboard/customer/bookings" className="nav-item active">
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
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dash-header">
          <div>
            <h1 className="premium-text">My Reservations</h1>
            <p className="text-muted">Manage your luxury stays and booking history</p>
          </div>
          <Link href="/dashboard/customer/book" className="btn btn-primary premium-btn">+ Reserve New Suite</Link>
        </header>

        {/* Guest Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📅</span>
            <p className="stat-label">Total Reservations</p>
            <p className="stat-value">{stats.total}</p>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🌟</span>
            <p className="stat-label">Active Stays</p>
            <p className="stat-value" style={{ color: 'var(--color-accent)' }}>{stats.active}</p>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💰</span>
            <p className="stat-label">Luxury Investment</p>
            <p className="stat-value" style={{ color: 'var(--color-accent-secondary)' }}>${stats.spent.toLocaleString()}</p>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {['all', 'confirmed', 'pending', 'cancelled'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '100px',
                border: 'none',
                background: filter === f ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                color: filter === f ? 'white' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Reference', 'Room', 'Check-In', 'Check-Out', 'Payment', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1.1rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600 }}>BK-{b.id}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem' }}>#{b.room?.room_number || 'TBD'}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#94a3b8' }}>{b.check_in_date}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#94a3b8' }}>{b.check_out_date}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '100px', 
                      fontSize: '0.7rem', 
                      fontWeight: 600,
                      background: PAYMENT_STYLE[b.payment_status]?.bg,
                      color: PAYMENT_STYLE[b.payment_status]?.color
                    }}>
                      {b.payment_status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '100px', 
                      fontSize: '0.7rem', 
                      fontWeight: 600,
                      background: STATUS_STYLE[b.status]?.bg,
                      color: STATUS_STYLE[b.status]?.color
                    }}>
                      {STATUS_STYLE[b.status]?.label || b.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    {b.payment_status === 'pending' && b.status !== 'cancelled' ? (
                      <Link href={`/dashboard/customer/payment/${b.id}`} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                        Pay Now
                      </Link>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>No Actions</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    No reservations found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
