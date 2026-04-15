'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import '../../../dashboard.css';

export default function CustomerPayment() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const { id } = useParams();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hotelm-backend-final.onrender.com';

  useEffect(() => {
    const fetchBooking = async () => {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/signin');

      try {
        const res = await fetch(`${API_URL}/api/bookings/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Booking not found');
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, router, API_URL]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setPaying(true);
    setError('');

    const token = localStorage.getItem('token');

    try {
      // Simulate real payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const res = await fetch(`${API_URL}/api/bookings/${id}/pay`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Payment failed. Please try again.');

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/customer/bookings');
      }, 3000);
    } catch (err) {
      setError(err.message);
      setPaying(false);
    }
  };

  if (loading) return <div className="dashboard-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Processing checkout...</p></div>;

  if (success) return (
    <div className="dashboard-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="card" style={{ maxWidth: '400px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
        <h2>Payment Successful!</h2>
        <p style={{ color: '#94a3b8', margin: '1rem 0 2rem' }}>Thank you for choosing Hotel M. Your stay is now confirmed.</p>
        <p>Redirecting to your reservations...</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">Hotel M</Link>
        <nav className="nav-menu">
          <Link href="/dashboard/customer" className="nav-item"><span>🏠 Overview</span></Link>
          <Link href="/dashboard/customer/bookings" className="nav-item"><span>📅 My Bookings</span></Link>
          <Link href="/dashboard/customer/book" className="nav-item"><span>🗝️ Book a Room</span></Link>
          <Link href="/profile" className="nav-item"><span>👤 Profile</span></Link>
        </nav>
      </aside>

      <main className="main-content" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <Link href="/dashboard/customer/bookings" style={{ color: '#3b82f6', marginBottom: '2rem', display: 'inline-block' }}>← Back to Dashboard</Link>
        
        <header className="dash-header">
          <h1>Finalize Payment</h1>
        </header>

        {error && <div className="auth-error">{error}</div>}

        <div className="dash-grid">
          {/* Payment Form */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Billing Details</h3>
            <form className="auth-form" onSubmit={handlePayment}>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="•••• •••• •••• ••••" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" required />
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input type="text" placeholder="•••" required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary auth-submit" disabled={paying} style={{ marginTop: '1rem' }}>
                {paying ? 'Processing Transaction...' : `Pay $${booking?.total_amount}`}
              </button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Stay Summary</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">🏨</div>
                <div className="activity-info">
                  <h4>Room {booking?.room?.room_number}</h4>
                  <p>{booking?.room?.status} Suite</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📅</div>
                <div className="activity-info">
                  <h4>Check-in / Out</h4>
                  <p style={{ fontSize: '0.8rem' }}>{booking?.check_in_date} to {booking?.check_out_date}</p>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>Subtotal</span>
                  <span>${booking?.total_amount}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>Service Fee</span>
                  <span>$0.00</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem' }}>
                  <span>Total</span>
                  <span style={{ color: '#3b82f6' }}>${booking?.total_amount}</span>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
