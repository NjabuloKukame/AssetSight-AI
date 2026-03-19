'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-black rounded-lg group-hover:scale-110 transition-transform">
              {/* <Sparkles className="w-4 h-4 text-white" /> */}
            </div>
            <span className="text-lg sm:text-xl font-bold text-black hidden sm:inline">Asset Sight AI Training</span>
            <span className="text-lg font-bold text-black sm:hidden">Asset Sight</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-black text-white'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              Home
            </Link>

            <Link
              href="/prototype-1"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/prototype-1')
                  ? 'bg-black text-white'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              3D Learning
            </Link>

            <Link
              href="/prototype-2"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/prototype-2')
                  ? 'bg-black text-white'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              AI Avatar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-black/5 rounded-lg transition-all"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-black" />
            ) : (
              <Menu className="w-6 h-6 text-black" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-2">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-black text-white'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              Home
            </Link>

            <Link
              href="/prototype-1"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive('/prototype-1')
                  ? 'bg-black text-white'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              3D Learning
            </Link>

            <Link
              href="/prototype-2"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive('/prototype-2')
                  ? 'bg-black text-white'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              AI Avatar
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
