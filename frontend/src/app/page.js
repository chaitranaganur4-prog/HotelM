'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (token) {
      setIsLoggedIn(true);
      setRole(userRole);
    }
  }, []);

  const dashboardPath = role === 'customer' ? '/dashboard/customer' : '/dashboard';

  return (
    <main className="container">
      <nav className="navbar">
        <div className="logo">Hotel M</div>
        <div className="nav-links">
          <Link href="/explore" className="btn btn-outline">Explore Rooms</Link>
          {isLoggedIn ? (
            <Link href={dashboardPath} className="btn btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline" style={{ border: 'none', color: 'var(--color-accent)' }}>Guest Login</Link>
              <Link href="/signin" className="btn btn-primary" style={{ background: 'var(--color-secondary)' }}>Staff Access</Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>
            <span>Elevate Your</span>
            <span>Hotel Operations</span>
          </h1>
          <p>The all-in-one management suite designed for the modern luxury hotelier. Streamline bookings, track assets, and deliver world-class service.</p>
          <div className="hero-actions">
            {isLoggedIn ? (
              <Link href={dashboardPath} className="btn btn-lg btn-primary">Go to Dashboard</Link>
            ) : (
              <>
                <Link href="/signup" className="btn btn-lg btn-primary">Book Now</Link>
                <Link href="/login" className="btn btn-lg btn-outline" style={{ color: '#fff' }}>Guest Portal</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-glow"></div>
          <img 
            src="/hero-management.png" 
            alt="Hotel Management Interface" 
            className="hero-img-main" 
          />
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <span className="feature-icon">📊</span>
          <h3>Live Analytics</h3>
          <p>Track occupancy rates, revenue, and guest trends in real-time with our intuitive dashboard.</p>
        </div>
        <div className="feature">
          <span className="feature-icon">🗝️</span>
          <h3>Room Management</h3>
          <p>Easily manage room status, cleaning schedules, and maintenance requests in one place.</p>
        </div>
        <div className="feature">
          <span className="feature-icon">🤝</span>
          <h3>Guest Portal</h3>
          <p>Deliver a seamless booking experience for your guests with our white-label reservation system.</p>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 Hotel M Management System. All rights reserved.</p>
      </footer>
    </main>
  );
}
