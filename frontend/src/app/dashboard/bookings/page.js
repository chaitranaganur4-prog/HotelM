'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../dashboard.css';

const BOOKINGS = [
  { id: 'BK-001', guest: 'John Doe',       room: '402', type: 'Premium Suite',   checkIn: '2026-03-28', checkOut: '2026-03-31', nights: 3, amount: 1200, status: 'confirmed', payment: 'paid' },
  { id: 'BK-002', guest: 'Sarah Wilson',    room: '105', type: 'Standard Double', checkIn: '2026-03-30', checkOut: '2026-04-02', nights: 3, amount: 330,  status: 'checked_in', payment: 'paid' },
  { id: 'BK-003', guest: 'Ravi Kumar',      room: '202', type: 'Suite',           checkIn: '2026-04-01', checkOut: '2026-04-04', nights: 3, amount: 750,  status: 'confirmed', payment: 'pending' },
  { id: 'BK-004', guest: 'Priya Sharma',    room: '103', type: 'Standard Single', checkIn: '2026-03-25', checkOut: '2026-03-27', nights: 2, amount: 160,  status: 'checked_out', payment: 'paid' },
  { id: 'BK-005', guest: 'Mike Johnson',    room: '301', type: 'Suite',           checkIn: '2026-04-05', checkOut: '2026-04-08', nights: 3, amount: 750,  status: 'confirmed', payment: 'pending' },
  { id: 'BK-006', guest: 'Anjali Singh',    room: '204', type: 'Deluxe Double',   checkIn: '2026-03-29', checkOut: '2026-03-31', nights: 2, amount: 300,  status: 'checked_in', payment: 'paid' },
  { id: 'BK-007', guest: 'Tom Harper',      room: '303', type: 'Suite',           checkIn: '2026-03-20', checkOut: '2026-03-22', nights: 2, amount: 500,  status: 'cancelled', payment: 'refunded' },
  { id: 'BK-008', guest: 'Nisha Patel',     room: '403', type: 'Premium Suite',   checkIn: '2026-04-10', checkOut: '2026-04-13', nights: 3, amount: 1200, status: 'confirmed', payment: 'pending' },
  { id: 'BK-009', guest: 'Vikram Mehta',    room: '104', type: 'Deluxe Double',   checkIn: '2026-03-31', checkOut: '2026-04-03', nights: 3, amount: 450,  status: 'checked_in', payment: 'paid' },
  { id: 'BK-010', guest: 'Emily Clarke',    room: '201', type: 'Deluxe Double',   checkIn: '2026-03-22', checkOut: '2026-03-24', nights: 2, amount: 300,  status: 'checked_out', payment: 'paid' },
];

const STATUS_STYLE = {
  confirmed:   { bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6', label: 'Confirmed' },
  checked_in:  { bg: 'rgba(34,197,94,0.12)',   color: '#22c55e', label: 'Checked In' },
  checked_out: { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', label: 'Checked Out' },
  cancelled:   { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444', label: 'Cancelled' },
};

const PAYMENT_STYLE = {
  paid:     { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e' },
  pending:  { bg: 'rgba(234,179,8,0.1)',   color: '#eab308' },
  refunded: { bg: 'rgba(168,85,247,0.1)',  color: '#a855f7' },
};

export default function BookingsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/signin');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  const filtered = BOOKINGS.filter(b => {
    const matchFilter = filter === 'all' || b.status === filter;
    const q = search.toLowerCase();
    const matchSearch = b.guest.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.room.includes(q);
    return matchFilter && matchSearch;
  });

  const counts = {
    all: BOOKINGS.length,
    confirmed: BOOKINGS.filter(b => b.status === 'confirmed').length,
    checked_in: BOOKINGS.filter(b => b.status === 'checked_in').length,
    checked_out: BOOKINGS.filter(b => b.status === 'checked_out').length,
    cancelled: BOOKINGS.filter(b => b.status === 'cancelled').length,
  };

  const totalRevenue = BOOKINGS.filter(b => b.payment === 'paid').reduce((s, b) => s + b.amount, 0);

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
            <p className="stat-trend" style={{ color: '#94a3b8' }}>All time</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Confirmed</p>
            <p className="stat-value" style={{ color: '#3b82f6' }}>{counts.confirmed}</p>
            <p className="stat-trend trend-up">Upcoming stays</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Currently Checked In</p>
            <p className="stat-value" style={{ color: '#22c55e' }}>{counts.checked_in}</p>
            <p className="stat-trend trend-up">Active guests</p>
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
          {['all', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.625rem 1.1rem', borderRadius: 100, cursor: 'pointer', fontWeight: 600,
              fontSize: '0.82rem', border: 'none', transition: 'all 0.2s', fontFamily: 'inherit',
              background: filter === f
                ? (f === 'all' ? '#3b82f6' : STATUS_STYLE[f]?.bg || 'rgba(59,130,246,0.15)')
                : 'rgba(255,255,255,0.05)',
              color: filter === f
                ? (f === 'all' ? '#fff' : STATUS_STYLE[f]?.color || '#3b82f6')
                : '#94a3b8',
            }}>
              {f === 'all' ? 'All' : STATUS_STYLE[f]?.label} ({f === 'all' ? counts.all : counts[f] ?? 0})
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Booking ID', 'Guest', 'Room', 'Check-In', 'Check-Out', 'Nights', 'Amount', 'Payment', 'Status', ''].map(h => (
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
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#3b82f6', fontWeight: 600 }}>{b.id}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: 500 }}>{b.guest}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>#{b.room}</span>
                    <br /><span style={{ fontSize: '0.75rem' }}>{b.type}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#94a3b8' }}>{b.checkIn}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#94a3b8' }}>{b.checkOut}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', textAlign: 'center' }}>{b.nights}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>${b.amount}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ padding: '0.2rem 0.65rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, background: PAYMENT_STYLE[b.payment].bg, color: PAYMENT_STYLE[b.payment].color }}>
                      {b.payment.charAt(0).toUpperCase() + b.payment.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ padding: '0.2rem 0.65rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, background: STATUS_STYLE[b.status].bg, color: STATUS_STYLE[b.status].color }}>
                      {STATUS_STYLE[b.status].label}
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
                  <td colSpan={10} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    No bookings match your search.
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
              ['Booking ID', selected.id],
              ['Guest', selected.guest],
              ['Room', `#${selected.room} — ${selected.type}`],
              ['Check-In', selected.checkIn],
              ['Check-Out', selected.checkOut],
              ['Duration', `${selected.nights} nights`],
              ['Total Amount', `$${selected.amount}`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                <span style={{ color: '#94a3b8' }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Status</span>
              <span style={{ padding: '0.25rem 0.75rem', borderRadius: 100, fontSize: '0.78rem', fontWeight: 600, background: STATUS_STYLE[selected.status].bg, color: STATUS_STYLE[selected.status].color }}>
                {STATUS_STYLE[selected.status].label}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Payment</span>
              <span style={{ padding: '0.25rem 0.75rem', borderRadius: 100, fontSize: '0.78rem', fontWeight: 600, background: PAYMENT_STYLE[selected.payment].bg, color: PAYMENT_STYLE[selected.payment].color }}>
                {selected.payment.charAt(0).toUpperCase() + selected.payment.slice(1)}
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
