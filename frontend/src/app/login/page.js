'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hotelm-backend-erid.onrender.com';
      const res = await fetch(`${apiUrl}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Invalid email or password');
      }

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userRole', data.role);
      
      setSuccess('Welcome back! Redirecting...');
      
      setTimeout(() => {
        if (data.role === 'customer') {
          router.push('/dashboard/customer');
        } else {
          router.push('/dashboard');
        }
      }, 1500);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      if (!success) setLoading(false);
    }
  };

  return (
    <div className="guest-login-container">
      <div className="login-backdrop">
        <div className="blob"></div>
        <div className="blob shadow"></div>
      </div>
      
      <div className="auth-card guest-card">
        <div className="auth-header">
          <Link href="/" className="auth-logo">Hotel M</Link>
          <div className="premium-badge">Guest Portal</div>
          <h2>Welcome Back</h2>
          <p>Login to manage your reservations and profile</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit premium-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Your Stay'}
          </button>
        </form>

        <div className="auth-footer">
          <p>New Guest? <Link href="/signup">Create an Account</Link></p>
          <div className="divider"><span>OR</span></div>
          <Link href="/signin" className="staff-toggle">Staff Access</Link>
        </div>
      </div>

      <style jsx>{`
        .guest-login-container {
          display: flex;
          min-height: 100vh;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: #020617;
          position: relative;
          overflow: hidden;
        }

        .login-backdrop {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .blob {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          top: -100px;
          right: -100px;
          animation: float 20s infinite alternate;
        }

        .blob.shadow {
          background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%);
          bottom: -150px;
          left: -150px;
          animation: float 25s infinite alternate-reverse;
        }

        @keyframes float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 100px); }
        }

        .guest-card {
          z-index: 2;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
        }

        .premium-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #60a5fa;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .premium-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border: none;
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
        }

        .premium-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 15px 20px -3px rgba(59, 130, 246, 0.4);
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1.5rem 0;
          color: #475569;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .divider span {
          padding: 0 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .staff-toggle {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          display: inline-block;
          margin-top: 0.5rem;
        }

        .staff-toggle:hover {
          color: #3b82f6;
        }
      `}</style>
    </div>
  );
}
