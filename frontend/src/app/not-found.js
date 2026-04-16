import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem', background: '#020617', color: 'white' }}>
      <h2>404 - Page Not Found</h2>
      <p>Could not find the requested resource</p>
      <Link href="/" style={{ padding: '0.5rem 1rem', background: '#3b82f6', borderRadius: '8px', textDecoration: 'none', color: 'white' }}>
        Return Home
      </Link>
    </div>
  );
}
