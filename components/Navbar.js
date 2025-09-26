import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="container-max">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold gradient-text">Momentum</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200">
              How It Works
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200">
              Pricing
            </Link>
            <Link href="/signin" className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200">
              Sign In
            </Link>
            <Link href="/new" className="btn-primary">
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-around">
              <span className={`block h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="py-4 space-y-4 border-t border-gray-100">
            <Link href="#features" className="block text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
              Features
            </Link>
            <Link href="#how-it-works" className="block text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
              How It Works
            </Link>
            <Link href="/pricing" className="block text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </Link>
            <Link href="/signin" className="block text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
              Sign In
            </Link>
            <Link href="/new" className="btn-primary inline-block text-center" onClick={() => setIsMenuOpen(false)}>
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}