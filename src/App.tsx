import { CheckCircle2, X } from 'lucide-react';
import { useEffect } from 'react';
import { subscribeToStoreRealtime } from '../lib/supabase';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { AdminPage } from './pages/AdminPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CompanyPage } from './pages/CompanyPage';
import { CraftPage } from './pages/CraftPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ShopPage } from './pages/ShopPage';
import { useStore } from './store/useStore';
import type { RoutePath } from './types/jewelry';

const VALID_ROUTES: RoutePath[] = [
  '/',
  '/shop',
  '/craft',
  '/company',
  '/checkout',
  '/login',
  '/admin',
];

export default function App() {
  const { currentRoute, navigate, toastMessage, clearToast } = useStore();

  // Sync browser back/forward navigation & deep-linked query piece
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pieceParam = params.get('piece');
    if (pieceParam) {
      useStore.getState().setSelectedProductSlug(pieceParam);
    }

    const handlePopState = () => {
      const path = window.location.pathname as RoutePath;
      const target = VALID_ROUTES.includes(path) ? path : '/';
      useStore.setState({ currentRoute: target });
    };

    window.addEventListener('popstate', handlePopState);
    const unsubscribe = subscribeToStoreRealtime({});

    return () => {
      window.removeEventListener('popstate', handlePopState);
      unsubscribe();
    };
  }, [navigate]);

  const renderPage = () => {
    switch (currentRoute) {
      case '/':
        return <HomePage />;
      case '/shop':
        return <ShopPage />;
      case '/craft':
        return <CraftPage />;
      case '/company':
        return <CompanyPage />;
      case '/checkout':
        return <CheckoutPage />;
      case '/login':
        return <LoginPage />;
      case '/admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E1E1E]">
      <Header />

      <main className="flex-1">{renderPage()}</main>

      <Footer />
      <CartDrawer />

      {/* Subtle Real-Time Action Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#1B3B2B] text-[#FAF7F2] px-4 py-3 rounded-lg shadow-xl border border-[#C5A059]/40 flex items-center gap-3 text-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span className="flex-1">{toastMessage}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={clearToast}
            className="text-[#FAF7F2]/70 hover:text-[#FAF7F2] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
