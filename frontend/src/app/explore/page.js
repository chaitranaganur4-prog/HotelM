'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ExploreRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API_URL}/api/rooms?status=available`);
        if (!res.ok) throw new Error('Failed to fetch rooms');
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [API_URL]);

  const handleBookRedirect = () => {
    router.push('/signin');
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 0% 0%, #1e1b4b 0%, #020617 100%)' }}>
      <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Discovering your dream suite...</p>
    </div>
  );

  return (
    <main className="container">
      <nav className="navbar">
        <Link href="/" className="logo">Hotel M</Link>
        <div className="nav-links">
          <Link href="/signin" className="btn btn-outline">Customer Login</Link>
          <Link href="/signup" className="btn btn-primary">Join Now</Link>
        </div>
      </nav>

      <div style={{ padding: '4rem 0' }}>
        <header style={{ 
          marginBottom: '4rem', 
          textAlign: 'center',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1.5px' }}>
            Explore Our <span style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Luxury Suites</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
            Experience unparalleled comfort and style in our carefully curated collection of premium living spaces.
          </p>
        </header>

        <style jsx>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .room-card {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0;
          }
          .room-card:nth-child(1) { animation-delay: 0.1s; }
          .room-card:nth-child(2) { animation-delay: 0.2s; }
          .room-card:nth-child(3) { animation-delay: 0.3s; }
          .room-card:nth-child(4) { animation-delay: 0.4s; }
        `}</style>

        {error && <div className="auth-error">{error}</div>}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {rooms.map((room, index) => (
            <div key={room.id} className="feature room-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ 
                height: '240px', 
                background: 'linear-gradient(45deg, #1e293b, #0f172a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                position: 'relative'
              }}>
                🏨
                <div style={{ 
                  position: 'absolute', 
                  bottom: '1rem', 
                  right: '1rem', 
                  background: 'rgba(59, 130, 246, 0.2)', 
                  padding: '0.4rem 1rem', 
                  borderRadius: '100px', 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: '#60a5fa', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {room.room_type?.name || 'Exclusive'}
                </div>
              </div>
              
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Room {room.room_number}</h3>
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Floor {room.floor}</span>
                </div>
                
                <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '1rem' }}>
                  Enjoy world-class amenities and breathtaking views in this {room.room_type?.name.toLowerCase()} sanctuary.
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  paddingTop: '1.5rem'
                }}>
                  <div>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>${room.room_type?.base_price || 125}</span>
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8', marginLeft: '0.4rem' }}>/ night</span>
                  </div>
                  <button 
                    onClick={handleBookRedirect} 
                    className="btn btn-primary"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {rooms.length === 0 && !loading && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '1.2rem' }}>All suites are currently occupied. Please check back later.</p>
            </div>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2026 Hotel M Management System. All rights reserved.</p>
      </footer>
    </main>
  );
}
