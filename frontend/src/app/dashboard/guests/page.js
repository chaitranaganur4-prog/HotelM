'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../dashboard.css';

const GUESTS = [
  { id: 'G-001', firstName: 'John',      lastName: 'Doe',       email: 'john.doe@email.com',          phone: '+1 555-0101', idType: 'Passport',    idNumber: 'A1234567', address: 'New York, USA',        bookings: 3, totalSpent: 2100, lastStay: '2026-03-31' },
  { id: 'G-002', firstName: 'Sarah',     lastName: 'Wilson',    email: 'sarah.wilson@email.com',       phone: '+1 555-0102', idType: 'Driver Lic',  idNumber: 'DL8765432', address: 'Los Angeles, USA',    bookings: 2, totalSpent: 630,  lastStay: '2026-03-30' },
  { id: 'G-003', firstName: 'Ravi',      lastName: 'Kumar',     email: 'ravi.kumar@email.com',         phone: '+91 9876543210', idType: 'Aadhaar',  idNumber: '1234 5678 9012', address: 'Bangalore, India', bookings: 1, totalSpent: 750, lastStay: '2026-04-01' },
  { id: 'G-004', firstName: 'Priya',     lastName: 'Sharma',    email: 'priya.sharma@email.com',       phone: '+91 8765432109', idType: 'Passport',  idNumber: 'P9876543', address: 'Mumbai, India',       bookings: 4, totalSpent: 1840, lastStay: '2026-03-27' },
  { id: 'G-005', firstName: 'Mike',      lastName: 'Johnson',   email: 'mike.johnson@email.com',       phone: '+44 7911 123456', idType: 'Passport', idNumber: 'GB123456D', address: 'London, UK',          bookings: 1, totalSpent: 750,  lastStay: '2026-04-05' },
  { id: 'G-006', firstName: 'Anjali',    lastName: 'Singh',     email: 'anjali.singh@email.com',       phone: '+91 7654321098', idType: 'Aadhaar',  idNumber: '9876 5432 1098', address: 'Delhi, India',    bookings: 2, totalSpent: 600,  lastStay: '2026-03-29' },
  { id: 'G-007', firstName: 'Tom',       lastName: 'Harper',    email: 'tom.harper@email.com',         phone: '+1 555-0107', idType: 'Driver Lic',  idNumber: 'DL1234567', address: 'Chicago, USA',        bookings: 1, totalSpent: 0,    lastStay: '2026-03-20' },
  { id: 'G-008', firstName: 'Nisha',     lastName: 'Patel',     email: 'nisha.patel@email.com',        phone: '+91 6543210987', idType: 'Passport',  idNumber: 'N3456789', address: 'Ahmedabad, India',    bookings: 1, totalSpent: 1200, lastStay: '2026-04-10' },
  { id: 'G-009', firstName: 'Vikram',    lastName: 'Mehta',     email: 'vikram.mehta@email.com',       phone: '+91 5432109876', idType: 'Aadhaar',  idNumber: '5678 9012 3456', address: 'Hyderabad, India', bookings: 2, totalSpent: 900, lastStay: '2026-03-31' },
  { id: 'G-010', firstName: 'Emily',     lastName: 'Clarke',    email: 'emily.clarke@email.com',       phone: '+44 7922 654321', idType: 'Passport', idNumber: 'GB654321F', address: 'Manchester, UK',       bookings: 1, totalSpent: 300,  lastStay: '2026-03-22' },
];

function getInitials(f, l) { return (f[0] + l[0]).toUpperCase(); }

const AVATAR_COLORS = ['#3b82f6','#8b5cf6','#22c55e','#ef4444','#f97316','#06b6d4','#ec4899','#eab308','#14b8a6','#a855f7'];

export default function GuestsPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/signin');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  const filtered = GUESTS
    .filter(g => {
      const q = search.toLowerCase();
      return (
        g.firstName.toLowerCase().includes(q) ||
        g.lastName.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.id.toLowerCase().includes(q) ||
        g.address.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.firstName.localeCompare(b.firstName);
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
      if (sortBy === 'bookings') return b.bookings - a.bookings;
      return 0;
    });

  const totalRevenue = GUESTS.reduce((s, g) => s + g.totalSpent, 0);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">Hotel M</Link>
        <nav className="nav-menu">
          <Link href="/dashboard" className="nav-item"><span>🏠 Overview</span></Link>
          <Link href="/dashboard/rooms" className="nav-item"><span>🔑 Rooms</span></Link>
          <Link href="/dashboard/bookings" className="nav-item"><span>📅 Bookings</span></Link>
          <Link href="/dashboard/guests" className="nav-item active"><span>👥 Guests</span></Link>
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
            <h1>Guests</h1>
            <p style={{ color: '#94a3b8' }}>Manage guest profiles and history</p>
          </div>
          <div className="user-profile">
            <div className="avatar">AD</div>
            <span>Admin</span>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Guests</p>
            <p className="stat-value">{GUESTS.length}</p>
            <p className="stat-trend" style={{ color: '#94a3b8' }}>Registered</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Bookings</p>
            <p className="stat-value">{GUESTS.reduce((s, g) => s + g.bookings, 0)}</p>
            <p className="stat-trend trend-up">Across all guests</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">${totalRevenue.toLocaleString()}</p>
            <p className="stat-trend trend-up">All time</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Avg. Spend / Guest</p>
            <p className="stat-value">${Math.round(totalRevenue / GUESTS.length).toLocaleString()}</p>
            <p className="stat-trend" style={{ color: '#94a3b8' }}>Per guest</p>
          </div>
        </div>

        {/* Search & Sort */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by name, email, ID or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 200, padding: '0.75rem 1rem',
              background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, color: '#f8fafc', outline: 'none', fontFamily: 'inherit',
            }}
          />
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Sort by:</span>
          {[['name','Name'],['bookings','Bookings'],['spent','Total Spent']].map(([val, label]) => (
            <button key={val} onClick={() => setSortBy(val)} style={{
              padding: '0.6rem 1.1rem', borderRadius: 100, cursor: 'pointer', border: 'none',
              fontFamily: 'inherit', fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s',
              background: sortBy === val ? '#3b82f6' : 'rgba(255,255,255,0.05)',
              color: sortBy === val ? '#fff' : '#94a3b8',
            }}>{label}</button>
          ))}
        </div>

        {/* Guest Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((g, i) => (
            <div key={g.id} className="card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => setSelected(g)}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0,
                  background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                }}>
                  {getInitials(g.firstName, g.lastName)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>{g.firstName} {g.lastName}</p>
                  <p style={{ color: '#64748b', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>📍 {g.address}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>📅 Bookings</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{g.bookings}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>💰 Total Spent</span>
                  <span style={{ color: '#22c55e', fontWeight: 700 }}>${g.totalSpent.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>🗓 Last Stay</span>
                  <span style={{ color: '#fff' }}>{g.lastStay}</span>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'right' }}>
                <span style={{ color: '#3b82f6', fontSize: '0.8rem', fontWeight: 600 }}>View Profile →</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</p>
              <p>No guests match your search.</p>
            </div>
          )}
        </div>
      </main>

      {/* Guest Detail Modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
            padding: '2.5rem', width: '100%', maxWidth: 460, boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem',
                  background: AVATAR_COLORS[GUESTS.indexOf(selected) % AVATAR_COLORS.length],
                }}>
                  {getInitials(selected.firstName, selected.lastName)}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.3rem' }}>{selected.firstName} {selected.lastName}</h2>
                  <p style={{ color: '#64748b', fontSize: '0.82rem' }}>{selected.id}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            {[
              ['Email', selected.email],
              ['Phone', selected.phone],
              ['Address', selected.address],
              ['ID Type', selected.idType],
              ['ID Number', selected.idNumber],
              ['Total Bookings', selected.bookings],
              ['Total Spent', `$${selected.totalSpent.toLocaleString()}`],
              ['Last Stay', selected.lastStay],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.7rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.875rem' }}>
                <span style={{ color: '#94a3b8' }}>{k}</span>
                <span style={{ fontWeight: 600, maxWidth: '60%', textAlign: 'right' }}>{v}</span>
              </div>
            ))}

            <button onClick={() => setSelected(null)} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.875rem', borderRadius: 12 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
