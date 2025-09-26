import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-primary">
          Momentum
        </Link>
        <div className="space-x-4">
          <Link href="/dashboard" className="hover:text-secondary">Dashboard</Link>
          <Link href="/new" className="hover:text-secondary">New</Link>
          <Link href="/settings" className="hover:text-secondary">Settings</Link>
        </div>
      </div>
    </nav>
  );
}