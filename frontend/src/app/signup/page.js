'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hotelm-backend-erid.onrender.com';
      const res = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'An error occurred during sign up');
      }

      setSuccess('Account created successfully! Redirecting to sign in...');
      
      // Delay redirect to show success message
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      if (!success) setLoading(false);
    }
  };

  return (
    <div className="auth-container premium-bg">
      <div className="login-backdrop">
        <div className="blob"></div>
        <div className="blob shadow"></div>
      </div>

      <div className="auth-card premium-card">
        <div className="auth-header">
          <Link href="/" className="auth-logo">Hotel M</Link>
          <div className="premium-badge">Join the Elite</div>
          <h2>Create Your Account</h2>
          <p>Join our exclusive community of premium guests</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select 
              id="role" 
              value={formData.role}
              onChange={handleChange}
              className="premium-select"
            >
              <option value="customer">Guest</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary auth-submit premium-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Get Exclusive Access'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already a member? <Link href="/login">Sign In</Link></p>
        </div>
      </div>

      <style jsx>{`
        .premium-bg {
          background: #020617;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
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
        .premium-card {
          z-index: 2;
          width: 100%;
          max-width: 500px;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(200, 200, 200, 0.1);
          padding: 3rem;
          border-radius: 24px;
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
        .premium-select {
          width: 100%;
          padding: 0.75rem;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          outline: none;
        }
        .premium-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border: none;
          padding: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          margin-top: 1.5rem;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .premium-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #94a3b8;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          outline: none;
        }
        input:focus {
          border-color: #3b82f6;
        }
        h2 { margin-bottom: 0.5rem; font-size: 1.875rem; }
        p { color: #94a3b8; margin-bottom: 2rem; }
      `}</style>
    </div>
  );
}
// test
