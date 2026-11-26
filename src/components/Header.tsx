import { Menu, ShoppingBag, User, X } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { RoutePath } from '../types/jewelry';

const NAV_ITEMS: { label: string; path: RoutePath }[] = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Craft', path: '/craft' },
  { label: 'Company', path: '/company' },
  { label: 'Checkout', path: '/checkout' },
  { label: 'Admin', path: '/admin' },
];

export function Header() {
  const { currentRoute, navigate, cart, setCartOpen, user } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNav = (path: RoutePath) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#1E1E1E]/10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNav('/');
          }}
          className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#1E1E1E] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B3B2B]"
        >
          Kala &amp; Karat
        </a>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentRoute === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.path);
                }}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B3B2B] ${
                  isActive
                    ? 'text-[#1B3B2B] font-semibold'
                    : 'text-[#1E1E1E]/70 hover:text-[#1E1E1E]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#C5A059]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Auth status link + Primary Bag CTA */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/login');
            }}
            className={`hidden sm:inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap shrink-0 py-1.5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B3B2B] ${
              currentRoute === '/login'
                ? 'text-[#1B3B2B] font-semibold'
                : 'text-[#1E1E1E]/75 hover:text-[#1E1E1E]'
            }`}
          >
            <User className="w-4 h-4 text-[#C5A059]" strokeWidth={1.75} />
            <span className="truncate max-w-[110px]">
              {user ? user.name.split(' ')[0] : 'Sign In'}
            </span>
          </a>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium bg-[#1B3B2B] text-[#FAF7F2] rounded-md hover:bg-[#142D20] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B3B2B]"
          >
            <ShoppingBag className="w-4 h-4 text-[#C5A059]" strokeWidth={1.75} />
            <span className="tabular-nums">Bag ({totalBagCount})</span>
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-[#1E1E1E] hover:bg-[#F1EBE0] rounded-md transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1E1E1E]/10 bg-[#FAF7F2] px-4 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentRoute === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.path);
                }}
                className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#1B3B2B] text-[#FAF7F2]'
                    : 'text-[#1E1E1E]/80 hover:bg-[#F1EBE0]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/login');
            }}
            className="block px-3 py-2.5 text-sm font-medium text-[#1B3B2B] border-t border-[#1E1E1E]/10 mt-2 pt-3"
          >
            {user ? `Account · ${user.name}` : 'Sign In / Create Account'}
          </a>
        </div>
      )}
    </header>
  );
}
