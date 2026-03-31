'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../dashboard.css';

const MONTHLY_REVENUE = [
  { month: 'Oct', revenue: 28400, bookings: 87 },
  { month: 'Nov', revenue: 31200, bookings: 94 },
  { month: 'Dec', revenue: 45600, bookings: 138 },
  { month: 'Jan', revenue: 38900, bookings: 112 },
  { month: 'Feb', revenue: 42100, bookings: 121 },
  { month: 'Mar', revenue: 52450, bookings: 156 },
];

const ROOM_TYPE_DATA = [
  { type: 'Standard Single', count: 20, booked: 12, revenue: 5760,  color: '#3b82f6' },
  { type: 'Standard Double', count: 18, booked: 14, revenue: 9240,  color: '#8b5cf6' },
  { type: 'Deluxe Double',   count: 15, booked: 13, revenue: 11700, color: '#22c55e' },
  { type: 'Suite',            count: 10, booked: 8,  revenue: 12000, color: '#f97316' },
  { type: 'Premium Suite',    count: 5,  booked: 5,  revenue: 12000, color: '#ec4899' },
];

const TOP_GUESTS = [
  { name: 'Priya Sharma',   bookings: 4, spent: 1840 },
  { name: 'John Doe',       bookings: 3, spent: 2100 },
  { name: 'Vikram Mehta',   bookings: 2, spent: 900  },
  { name: 'Anjali Singh',   bookings: 2, spent: 600  },
  { name: 'Sarah Wilson',   bookings: 2, spent: 630  },
];

const WEEKLY_OCCUPANCY = [
  { day: 'Mon', rate: 72 },
  { day: 'Tue', rate: 68 },
  { day: 'Wed', rate: 81 },
  { day: 'Thu', rate: 85 },
  { day: 'Fri', rate: 94 },
  { day: 'Sat', rate: 97 },
  { day: 'Sun', rate: 88 },
];

const maxRevenue = Math.max(...MONTHLY_REVENUE.map(m => m.revenue));

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('6m');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/signin');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  const totalRevenue = MONTHLY_REVENUE.reduce((s, m) => s + m.revenue, 0);
  const totalBookings = MONTHLY_REVENUE.reduce((s, m) => s + m.bookings, 0);
  const avgOccupancy = Math.round(WEEKLY_OCCUPANCY.reduce((s, d) => s + d.rate, 0) / WEEKLY_OCCUPANCY.length);
  const totalRooms = ROOM_TYPE_DATA.reduce((s, r) => s + r.count, 0);
  const bookedRooms = ROOM_TYPE_DATA.reduce((s, r) => s + r.booked, 0);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">Hotel M</Link>
        <nav className="nav-menu">
          <Link href="/dashboard" className="nav-item"><span>🏠 Overview</span></Link>
          <Link href="/dashboard/rooms" className="nav-item"><span>🔑 Rooms</span></Link>
          <Link href="/dashboard/bookings" className="nav-item"><span>📅 Bookings</span></Link>
          <Link href="/dashboard/guests" className="nav-item"><span>👥 Guests</span></Link>
          <Link href="/dashboard/analytics" className="nav-item active"><span>📊 Analytics</span></Link>
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
            <h1>Analytics</h1>
            <p style={{ color: '#94a3b8' }}>Performance overview & insights</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['1m','3m','6m'].map(p => (
                <button key={p} onClick={() => setPeriod(p)} style={{
                  padding: '0.5rem 1rem', borderRadius: 100, border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontWeight: 600, fontSize: '0.82rem',
                  background: period === p ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                  color: period === p ? '#fff' : '#94a3b8',
                }}>{p.toUpperCase()}</button>
              ))}
            </div>
            <div className="user-profile">
              <div className="avatar">AD</div>
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* KPI Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">${(totalRevenue / 1000).toFixed(1)}k</p>
            <p className="stat-trend trend-up">↑ 24% vs prev period</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Bookings</p>
            <p className="stat-value">{totalBookings}</p>
            <p className="stat-trend trend-up">↑ 18% vs prev period</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Avg. Occupancy</p>
            <p className="stat-value">{avgOccupancy}%</p>
            <p className="stat-trend trend-up">↑ 5% vs prev period</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Rooms Occupied</p>
            <p className="stat-value">{bookedRooms}/{totalRooms}</p>
            <p className="stat-trend" style={{ color: '#94a3b8' }}>Currently active</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Revenue Bar Chart */}
          <div className="card">
            <div className="card-header">
              <h3>Monthly Revenue</h3>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Last 6 months</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: 180, padding: '0.5rem 0' }}>
              {MONTHLY_REVENUE.map(m => {
                const heightPct = (m.revenue / maxRevenue) * 100;
                return (
                  <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>${(m.revenue/1000).toFixed(0)}k</span>
                    <div style={{ width: '100%', position: 'relative', borderRadius: '6px 6px 0 0', overflow: 'hidden', backgroundColor: 'rgba(59,130,246,0.1)' }}>
                      <div style={{
                        width: '100%',
                        height: `${heightPct * 1.4}px`,
                        background: 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.5s ease',
                      }} />
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Occupancy */}
          <div className="card">
            <div className="card-header">
              <h3>Weekly Occupancy</h3>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>This week</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {WEEKLY_OCCUPANCY.map(d => (
                <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', width: 28 }}>{d.day}</span>
                  <div style={{ flex: 1, height: 8, background: '#334155', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${d.rate}%`, borderRadius: 4,
                      background: d.rate >= 90 ? '#22c55e' : d.rate >= 75 ? '#3b82f6' : '#eab308',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, width: 36, textAlign: 'right' }}>{d.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Room Type Performance */}
          <div className="card">
            <div className="card-header">
              <h3>Revenue by Room Type</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ROOM_TYPE_DATA.map(r => {
                const maxRev = Math.max(...ROOM_TYPE_DATA.map(x => x.revenue));
                return (
                  <div key={r.type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: r.color, display: 'inline-block' }} />
                        {r.type}
                      </span>
                      <span style={{ fontWeight: 700 }}>${r.revenue.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 6, background: '#334155', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(r.revenue / maxRev) * 100}%`, background: r.color, borderRadius: 4, transition: 'width 0.5s' }} />
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>{r.booked}/{r.count} rooms occupied</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Guests */}
          <div className="card">
            <div className="card-header">
              <h3>Top Guests</h3>
              <Link href="/dashboard/guests" style={{ color: '#3b82f6', fontSize: '0.8rem', textDecoration: 'none' }}>View All</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {TOP_GUESTS.map((g, i) => (
                <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 0', borderBottom: i < TOP_GUESTS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                    background: ['#3b82f6','#8b5cf6','#22c55e','#f97316','#ec4899'][i],
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{g.name}</p>
                    <p style={{ color: '#64748b', fontSize: '0.78rem' }}>{g.bookings} bookings</p>
                  </div>
                  <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.9rem' }}>${g.spent.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
