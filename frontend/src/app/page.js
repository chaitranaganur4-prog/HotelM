import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <nav className="navbar">
        <div className="logo">Hotel M</div>
        <div className="nav-links">
          <Link href="/explore" className="btn btn-outline">Explore Rooms</Link>
          <Link href="/signin" className="btn btn-primary">Staff Login</Link>
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
            <Link href="/signup" className="btn btn-lg btn-primary">Get Started</Link>
            <Link href="/signin" className="btn btn-lg btn-outline">Go to Dashboard</Link>
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
