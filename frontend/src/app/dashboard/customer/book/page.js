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
        <Link href="/" className="sidebar-logo">Hotel M</Link>
        <nav className="nav-menu">
          <Link href="/dashboard/customer" className="nav-item"><span>🏠 Overview</span></Link>
          <Link href="/dashboard/customer/bookings" className="nav-item"><span>📅 My Bookings</span></Link>
          <Link href="/dashboard/customer/book" className="nav-item active"><span>🗝️ Book a Room</span></Link>
          <Link href="/profile" className="nav-item"><span>👤 Profile</span></Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dash-header">
          <h1>Find Your Perfect Stay</h1>
          <p style={{ color: '#94a3b8' }}>Explore our curated collection of luxury suites</p>
        </header>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {rooms.map(room => (
            <div key={room.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ 
                height: '180px', 
                backgroundColor: '#1e293b', 
                borderRadius: '12px', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem'
              }}>
                🏨
              </div>
              <h3>Room {room.room_number}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {room.room_type?.name || 'Exclusive Suite'} - {room.floor}th Floor
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>$125<span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#94a3b8' }}>/night</span></span>
                <button 
                  onClick={() => handleBook(room.id)} 
                  className="btn btn-primary"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Processing...' : 'Book Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
