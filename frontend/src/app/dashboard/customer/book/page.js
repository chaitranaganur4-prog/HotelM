'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../dashboard.css';

export default function CustomerBookRoom() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hotelm-backend-erid.onrender.com';

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API_URL}/api/rooms`);
        if (!res.ok) throw new Error('Failed to fetch rooms');
        const data = await res.json();
        // Only show available rooms
        setRooms(data.filter(r => r.status === 'available'));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [API_URL]);

  const handleBook = async (roomId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      // Mocking check-in/out for simplicity in this demo view
      const checkIn = new Date();
      const checkOut = new Date();
      checkOut.setDate(checkIn.getDate() + 2);

      const res = await fetch(`${API_URL}/api/bookings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          guest_id: 1, // We'll assume guest ID 1 for now, in a real app we'd fetch the specific guest_id linked to the staff email
          room_id: roomId,
          check_in_date: checkIn.toISOString().split('T')[0],
          check_out_date: checkOut.toISOString().split('T')[0],
          total_amount: 250.0 // Mocked price
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to create booking');
      }

      setSuccess('Redirecting to secure payment...');
      const data = await res.json();
      setTimeout(() => {
        router.push(`/dashboard/customer/payment/${data.id}`);
      }, 1500);
    } catch (err) {
      setError(err.message);
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="dashboard-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p>Finding the perfect room for you...</p>
  </div>;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">
          <span style={{ color: '#fff' }}>Hotel</span><span style={{ color: 'var(--color-accent)' }}>M</span>
        </Link>
        <nav className="nav-menu">
          <Link href="/dashboard/customer" className="nav-item">
            <span className="nav-icon">🏠</span>
            <span>Overview</span>
          </Link>
          <Link href="/dashboard/customer/bookings" className="nav-item">
            <span className="nav-icon">📅</span>
            <span>My Bookings</span>
          </Link>
          <Link href="/dashboard/customer/book" className="nav-item active">
            <span className="nav-icon">🗝️</span>
            <span>Book a Room</span>
          </Link>
          <Link href="/explore" className="nav-item">
            <span className="nav-icon">✨</span>
            <span>Explore Luxury</span>
          </Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dash-header">
          <div>
            <h1 className="premium-text">Find Your Perfect Stay</h1>
            <p className="text-muted">Explore our curated collection of luxury suites and exclusive escapes</p>
          </div>
        </header>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {rooms.map(room => (
            <div key={room.id} className="card premium-card-hover" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ 
                height: '200px', 
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))', 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem'
              }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700 }}>AVAILABLE</div>
                🏨
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                   <h3 style={{ fontSize: '1.25rem' }}>Room {room.room_number}</h3>
                   <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>$125<small style={{ fontWeight: 400, color: 'var(--text-muted)' }}>/nt</small></span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  {room.room_type?.name || 'Exclusive Suite'} • Floor {room.floor} • Premium View
                </p>
                <button 
                  onClick={() => handleBook(room.id)} 
                  className="btn btn-primary premium-btn"
                  style={{ width: '100%' }}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Securing Stay...' : 'Reserve This Room'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <style jsx>{`
        .nav-icon { margin-right: 0.75rem; font-size: 1.2rem; }
        .premium-card-hover { transition: all 0.3s ease; border: 1px solid var(--glass-border); }
        .premium-card-hover:hover { transform: translateY(-5px); border-color: var(--color-accent); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
      `}</style>
    </div>
  );
}
