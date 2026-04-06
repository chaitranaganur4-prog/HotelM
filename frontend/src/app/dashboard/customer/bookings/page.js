'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../dashboard.css';

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  if (loading) return <div className="dashboard-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p>Loading your reservations...</p>
  </div>;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">Hotel M</Link>
        <nav className="nav-menu">
          <Link href="/dashboard/customer" className="nav-item"><span>🏠 Overview</span></Link>
          <Link href="/dashboard/customer/bookings" className="nav-item active"><span>📅 My Bookings</span></Link>
          <Link href="/dashboard/customer/book" className="nav-item"><span>🗝️ Book a Room</span></Link>
          <Link href="/profile" className="nav-item"><span>👤 Profile</span></Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dash-header">
          <h1>My Reservations</h1>
          <Link href="/dashboard/customer/book" className="btn btn-primary">+ New Booking</Link>
        </header>

        {error && <div className="auth-error">{error}</div>}

        <div className="card">
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>You don&apos;t have any bookings yet.</p>
              <Link href="/dashboard/customer/book" className="btn btn-outline">Explore Our Rooms</Link>
            </div>
          ) : (
            <div className="activity-list">
              {bookings.map(booking => (
                <div key={booking.id} className="activity-item">
                  <div className="activity-icon">🏨</div>
                  <div className="activity-info">
                    <h4>{booking.room?.room_number ? `Room ${booking.room.room_number}` : 'Room details pending'}</h4>
                    <p>{new Date(booking.check_in_date).toDateString()} - {new Date(booking.check_out_date).toDateString()}</p>
                    <p style={{ fontSize: '0.75rem' }}>Total: ${booking.total_amount}</p>
                  </div>
                  <div className={`status-badge status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </div>
                  {booking.payment_status === 'pending' && booking.status !== 'cancelled' && (
                    <Link 
                      href={`/dashboard/customer/payment/${booking.id}`} 
                      className="btn btn-primary"
                      style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                    >
                      Pay Now
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
