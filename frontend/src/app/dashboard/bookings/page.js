'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../dashboard.css';

const STATUS_STYLE = {
  confirmed:   { bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6', label: 'Confirmed' },
  checked_in:  { bg: 'rgba(34,197,94,0.12)',   color: '#22c55e', label: 'Checked In' },
  checked_out: { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', label: 'Checked Out' },
  cancelled:   { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444', label: 'Cancelled' },
};

const PAYMENT_STYLE = {
  pending:  { bg: 'rgba(234,179,8,0.1)',   color: '#eab308' },
  paid:     { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e' },
  refunded: { bg: 'rgba(168,85,247,0.1)',  color: '#a855f7' },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hotelm-backend-erid.onrender.com';

  const fetchData = async () => {
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/bookings/`),
        fetch(`${API_URL}/api/stats`)
      ]);
      
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setBookings(data);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
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

  const filtered = bookings.filter(b => {
    let matchFilter = filter === 'all';
    
    if (filter === 'paid') {
      matchFilter = b.payment_status === 'paid';
    } else if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      matchFilter = b.check_in_date === today;
    } else if (filter !== 'all') {
      matchFilter = b.status === filter;
    }

    const q = search.toLowerCase();
    const guestName = `${b.guest?.first_name || ''} ${b.guest?.last_name || ''}`.toLowerCase();
    const matchSearch = guestName.includes(q) || 
                       b.id.toString().includes(q) || 
                       (b.room?.room_number || '').includes(q);
    return matchFilter && matchSearch;
  });

  const counts = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    checked_in: bookings.filter(b => b.status === 'checked_in').length,
    checked_out: bookings.filter(b => b.status === 'checked_out').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    paid: bookings.filter(b => b.payment_status === 'paid').length,
    today: bookings.filter(b => b.check_in_date === new Date().toISOString().split('T')[0]).length,
  };

  const totalRevenue = bookings
    .filter(b => b.payment_status === 'paid')
    .reduce((s, b) => s + parseFloat(b.total_amount || 0), 0);

  if (loading) {
    return <div className="dashboard-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>Loading bookings...</p>
    </div>;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">Hotel M</Link>
        <nav className="nav-menu">
          <Link href="/dashboard" className="nav-item"><span>🏠 Overview</span></Link>
          <Link href="/dashboard/rooms" className="nav-item"><span>🔑 Rooms</span></Link>
          <Link href="/dashboard/bookings" className="nav-item active"><span>📅 Bookings</span></Link>
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
            <h1>Bookings</h1>
            <p style={{ color: '#94a3b8' }}>Manage all hotel reservations</p>
          </div>
          <div className="user-profile">
            <div className="avatar">AD</div>
            <span>Admin</span>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Bookings</p>
            <p className="stat-value">{counts.all}</p>
            <p className="stat-trend" style={{ color: '#94a3b8' }}>Reservations</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Rooms</p>
            <p className="stat-value" style={{ color: '#8b5cf6' }}>{stats?.room_stats?.total || 12}</p>
            <p className="stat-trend" style={{ color: '#94a3b8' }}>Inventory</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Current Occupancy</p>
            <p className="stat-value" style={{ color: '#22c55e' }}>{stats?.room_stats?.occupancy_rate || 0}%</p>
            <p className="stat-trend trend-up">Active status</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Revenue Collected</p>
            <p className="stat-value">${totalRevenue.toLocaleString()}</p>
            <p className="stat-trend trend-up">Paid bookings</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by guest, ID or room..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 200, padding: '0.75rem 1rem',
              background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, color: '#f8fafc', outline: 'none', fontFamily: 'inherit',
            }}
          />
          {['all', 'today', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'paid'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.625rem 1.1rem', borderRadius: 100, cursor: 'pointer', fontWeight: 600,
              fontSize: '0.82rem', border: 'none', transition: 'all 0.2s', fontFamily: 'inherit',
              background: filter === f
                ? (f === 'all' ? '#3b82f6' : (f === 'paid' ? '#22c55e' : (f === 'today' ? '#f59e0b' : STATUS_STYLE[f]?.bg || 'rgba(59,130,246,0.15)')))
                : 'rgba(255,255,255,0.05)',
              color: filter === f ? '#fff' : '#94a3b8',
            }}>
              {f === 'all' ? 'All' : (f === 'paid' ? 'Paid' : (f === 'today' ? 'Today' : STATUS_STYLE[f]?.label))} ({f === 'all' ? counts.all : counts[f] ?? 0})
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['ID', 'Guest', 'Room', 'Check-In', 'Check-Out', 'Amount', 'Payment', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '1.1rem 1.25rem', textAlign: 'left', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setSelected(b)}
                >
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#3b82f6', fontWeight: 600 }}>BK-{b.id}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    {b.guest?.first_name} {b.guest?.last_name}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>#{b.room?.room_number}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#94a3b8' }}>{b.check_in_date}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#94a3b8' }}>{b.check_out_date}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>${parseFloat(b.total_amount).toLocaleString()}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ padding: '0.2rem 0.65rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, background: PAYMENT_STYLE[b.payment_status]?.bg || 'rgba(255,255,255,0.1)', color: PAYMENT_STYLE[b.payment_status]?.color || '#fff' }}>
                      {b.payment_status?.charAt(0).toUpperCase() + b.payment_status?.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ padding: '0.2rem 0.65rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, background: STATUS_STYLE[b.status]?.bg || 'rgba(59,130,246,0.15)', color: STATUS_STYLE[b.status]?.color || '#3b82f6' }}>
                      {STATUS_STYLE[b.status]?.label || b.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <button onClick={e => { e.stopPropagation(); setSelected(b); }} style={{ background: 'rgba(59,130,246,0.1)', border: 'none', color: '#3b82f6', padding: '0.35rem 0.85rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit', fontWeight: 600 }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    No bookings found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Detail Modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
            padding: '2.5rem', width: '100%', maxWidth: 440, boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem' }}>Booking Details</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {[
              ['Booking ID', `BK-${selected.id}`],
              ['Guest', `${selected.guest?.first_name} ${selected.guest?.last_name}`],
              ['Room', `#${selected.room?.room_number}`],
              ['Check-In', selected.check_in_date],
              ['Check-Out', selected.check_out_date],
              ['Total Amount', `$${parseFloat(selected.total_amount).toLocaleString()}`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                <span style={{ color: '#94a3b8' }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Status</span>
              <span style={{ padding: '0.25rem 0.75rem', borderRadius: 100, fontSize: '0.78rem', fontWeight: 600, background: STATUS_STYLE[selected.status]?.bg || 'rgba(59,130,246,0.15)', color: STATUS_STYLE[selected.status]?.color || '#3b82f6' }}>
                {STATUS_STYLE[selected.status]?.label || selected.status}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Payment</span>
              <span style={{ padding: '0.25rem 0.75rem', borderRadius: 100, fontSize: '0.78rem', fontWeight: 600, background: PAYMENT_STYLE[selected.payment_status]?.bg || 'rgba(255,255,255,0.1)', color: PAYMENT_STYLE[selected.payment_status]?.color || '#fff' }}>
                {selected.payment_status?.charAt(0).toUpperCase() + selected.payment_status?.slice(1)}
              </span>
            </div>
            <button onClick={() => setSelected(null)} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.875rem', borderRadius: 12 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
