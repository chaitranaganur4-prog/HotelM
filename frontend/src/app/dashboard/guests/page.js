'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../dashboard.css';

function getInitials(f, l) { 
  if (!f || !l) return '?';
  return (f[0] + l[0]).toUpperCase(); 
}

const AVATAR_COLORS = ['#3b82f6','#8b5cf6','#22c55e','#ef4444','#f97316','#06b6d4','#ec4899','#eab308','#14b8a6','#a855f7'];

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hotelm-backend-final.onrender.com';

  const fetchGuests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/guests/`);
      if (res.ok) {
        const data = await res.json();
        setGuests(data);
      }
    } catch (err) {
      console.error("Failed to fetch guests:", err);
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
    fetchGuests();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  const filtered = guests
    .filter(g => {
      const q = search.toLowerCase();
      const fullName = `${g.first_name} ${g.last_name}`.toLowerCase();
      return (
        fullName.includes(q) ||
        g.email.toLowerCase().includes(q) ||
        (g.phone || '').includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.first_name.localeCompare(b.first_name);
      return 0;
    });

  if (loading) {
    return <div className="dashboard-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>Loading guests...</p>
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
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div className="stat-card">
            <p className="stat-label">Total Guests</p>
            <p className="stat-value">{guests.length}</p>
            <p className="stat-trend" style={{ color: '#94a3b8' }}>Stored in database</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">New Guests</p>
            <p className="stat-value" style={{ color: '#22c55e' }}>{guests.length > 5 ? 5 : guests.length}</p>
            <p className="stat-trend trend-up">Recently added</p>
          </div>
        </div>

        {/* Search & Sort */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 200, padding: '0.75rem 1rem',
              background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, color: '#f8fafc', outline: 'none', fontFamily: 'inherit',
            }}
          />
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Sort by:</span>
          {[['name','Name']].map(([val, label]) => (
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
                  {getInitials(g.first_name, g.last_name)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>{g.first_name} {g.last_name}</p>
                  <p style={{ color: '#64748b', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>📱 Phone</span>
                  <span style={{ color: '#fff' }}>{g.phone || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>📅 ID</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{g.id}</span>
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
              <p>No guests found in the database.</p>
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
                  background: AVATAR_COLORS[guests.indexOf(selected) % AVATAR_COLORS.length],
                }}>
                  {getInitials(selected.first_name, selected.last_name)}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.3rem' }}>{selected.first_name} {selected.last_name}</h2>
                  <p style={{ color: '#64748b', fontSize: '0.82rem' }}>Guest ID: {selected.id}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            {[
              ['Email', selected.email],
              ['Phone', selected.phone || 'Not provided'],
              ['Last Name', selected.last_name],
              ['First Name', selected.first_name],
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
