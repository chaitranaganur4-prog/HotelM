'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../dashboard.css';

const STATUS_COLORS = {
  available: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', label: 'Available' },
  occupied:  { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', label: 'Occupied' },
  cleaning:  { bg: 'rgba(234,179,8,0.12)',  color: '#eab308', label: 'Cleaning' },
  maintenance: { bg: 'rgba(168,85,247,0.12)', color: '#a855f7', label: 'Maintenance' },
};

const STATUS_ICONS = {
  available: '✅',
  occupied: '🔴',
  cleaning: '🧹',
  maintenance: '🔧',
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingData, setBookingData] = useState({ 
    guestFirstName: '', 
    guestLastName: '', 
    email: '', 
    phone: '',
    checkIn: '', 
    checkOut: '', 
    notes: '' 
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hotel-management-system-5e1w.onrender.com';

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rooms/`);
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
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
    fetchRooms();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  const filtered = rooms.filter(r => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch = r.room_number.includes(search) || 
                         (r.room_type?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
  };

  const handleBookClick = (room) => {
    setSelectedRoom(room);
    setBookingData({ 
      guestFirstName: '', 
      guestLastName: '', 
      email: '', 
      phone: '',
      checkIn: '', 
      checkOut: '', 
      notes: '' 
    });
    setBookingSuccess(false);
    setShowModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      // 1. Create or Get Guest
      const guestRes = await fetch(`${API_URL}/api/guests/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: bookingData.guestFirstName,
          last_name: bookingData.guestLastName,
          email: bookingData.email,
          phone: bookingData.phone
        })
      });

      if (!guestRes.ok) {
        const guestData = await guestRes.json();
        throw new Error(guestData.detail || "Guest creation failed");
      }
      const guest = await guestRes.json();

      // 2. Create Booking
      const bookingRes = await fetch(`${API_URL}/api/bookings/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          guest_id: guest.id,
          room_id: selectedRoom.id,
          check_in_date: bookingData.checkIn,
          check_out_date: bookingData.checkOut,
          total_amount: selectedRoom.room_type?.base_price || 100
        })
      });

      if (bookingRes.ok) {
        setBookingSuccess(true);
        fetchRooms(); // Refresh rooms to show occupied status
        setTimeout(() => setShowModal(false), 2000);
      } else {
        const errData = await bookingRes.json();
        alert(`Booking failed: ${JSON.stringify(errData.detail) || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert(`Something went wrong: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="dashboard-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>Loading rooms...</p>
    </div>;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">Hotel M</Link>
        <nav className="nav-menu">
          <Link href="/dashboard" className="nav-item"><span>🏠 Overview</span></Link>
          <Link href="/dashboard/rooms" className="nav-item active"><span>🔑 Rooms</span></Link>
          <Link href="/dashboard/bookings" className="nav-item"><span>📅 Bookings</span></Link>
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
            <h1>Room Management</h1>
            <p style={{ color: '#94a3b8' }}>Manage and book hotel rooms</p>
          </div>
          <div className="user-profile">
            <div className="avatar">AD</div>
            <span>Admin</span>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          {['available', 'occupied', 'cleaning', 'maintenance'].map(s => (
            <div key={s} className="stat-card" style={{ cursor: 'pointer', border: filter === s ? `1px solid ${STATUS_COLORS[s].color}` : undefined }}
              onClick={() => setFilter(filter === s ? 'all' : s)}>
              <p className="stat-label">{STATUS_COLORS[s]?.label || s}</p>
              <p className="stat-value" style={{ color: STATUS_COLORS[s]?.color }}>{counts[s]}</p>
              <p className="stat-trend" style={{ color: '#94a3b8' }}>of {counts.all} rooms</p>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by room number or type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 200, padding: '0.75rem 1rem',
              background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, color: '#f8fafc', outline: 'none', fontFamily: 'inherit',
            }}
          />
          {['all', 'available', 'occupied', 'cleaning', 'maintenance'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.625rem 1.25rem', borderRadius: 100, cursor: 'pointer', fontWeight: 600,
                fontSize: '0.85rem', border: 'none', transition: 'all 0.2s',
                background: filter === f
                  ? (f === 'all' ? '#3b82f6' : STATUS_COLORS[f]?.bg)
                  : 'rgba(255,255,255,0.05)',
                color: filter === f
                  ? (f === 'all' ? '#fff' : STATUS_COLORS[f]?.color)
                  : '#94a3b8',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f] ?? counts.all})
            </button>
          ))}
        </div>

        {/* Rooms Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(room => {
            const sc = STATUS_COLORS[room.status] || STATUS_COLORS.available;
            return (
              <div key={room.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'transform 0.2s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Room {room.room_number}</span>
                  <span style={{ fontSize: '1.25rem' }}>{STATUS_ICONS[room.status] || '🏨'}</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{room.room_type?.name || 'Standard'}</p>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Floor {room.floor || 1}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600, background: sc.bg, color: sc.color }}>
                    {sc.label}
                  </span>
                  <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.9rem' }}>${room.room_type?.base_price || 100}/night</span>
                </div>
                {room.status === 'available' && (
                  <button
                    onClick={() => handleBookClick(room)}
                    className="btn btn-primary"
                    style={{ marginTop: '0.5rem', padding: '0.625rem', fontSize: '0.875rem', width: '100%', borderRadius: 10 }}
                  >
                    Book Now
                  </button>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</p>
              <p>No rooms found in the database.</p>
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {showModal && selectedRoom && (
        <div onClick={() => !isSubmitting && setShowModal(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
            padding: '2.5rem', width: '100%', maxWidth: 480, boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          }}>
            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</p>
                <h2 style={{ marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
                <p style={{ color: '#94a3b8' }}>Room {selectedRoom.room_number} is now occupied.</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Book Room {selectedRoom.room_number}</h2>
                  <p style={{ color: '#94a3b8' }}>{selectedRoom.room_type?.name} · ${selectedRoom.room_type?.base_price}/night</p>
                </div>
                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>First Name</label>
                      <input type="text" placeholder="John" required value={bookingData.guestFirstName}
                        onChange={e => setBookingData({ ...bookingData, guestFirstName: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Last Name</label>
                      <input type="text" placeholder="Doe" required value={bookingData.guestLastName}
                        onChange={e => setBookingData({ ...bookingData, guestLastName: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="john@email.com" required value={bookingData.email}
                      onChange={e => setBookingData({ ...bookingData, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+1 555-0000" value={bookingData.phone}
                      onChange={e => setBookingData({ ...bookingData, phone: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Check-In Date</label>
                      <input type="date" required value={bookingData.checkIn}
                        onChange={e => setBookingData({ ...bookingData, checkIn: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Check-Out Date</label>
                      <input type="date" required value={bookingData.checkOut}
                        onChange={e => setBookingData({ ...bookingData, checkOut: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button type="button" onClick={() => setShowModal(false)} disabled={isSubmitting}
                      style={{ flex: 1, padding: '0.875rem', borderRadius: 12, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer' }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '0.875rem', borderRadius: 12 }} disabled={isSubmitting}>
                      {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
