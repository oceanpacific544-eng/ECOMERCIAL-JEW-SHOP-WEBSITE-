import { createClient } from '@supabase/supabase-js';

/**
 * ============================================================================
 * KALA & KARAT — SUPABASE POSTGRESQL SCHEMA & REALTIME SETUP
 * ============================================================================
 * Run the SQL statements below in your Supabase SQL Editor to provision the
 * production database tables with Row Level Security (RLS) and Realtime enabled.
 *
 * 1. PRODUCTS TABLE
 * ----------------------------------------------------------------------------
 * CREATE TABLE IF NOT EXISTS public.products (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   slug TEXT UNIQUE NOT NULL,
 *   name TEXT NOT NULL,
 *   subtitle TEXT NOT NULL,
 *   category TEXT NOT NULL CHECK (category IN ('Necklaces', 'Rings', 'Earrings', 'Bracelets')),
 *   price_inr INTEGER NOT NULL CHECK (price_inr > 0),
 *   stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
 *   rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
 *   review_count INTEGER NOT NULL DEFAULT 0,
 *   image_url TEXT NOT NULL,
 *   is_signature BOOLEAN NOT NULL DEFAULT false,
 *   karat TEXT NOT NULL DEFAULT '22k Hallmarked Gold',
 *   gemstones TEXT NOT NULL,
 *   weight_grams NUMERIC(6,2) NOT NULL,
 *   craft_hours INTEGER NOT NULL,
 *   origin TEXT NOT NULL DEFAULT 'Jaipur Atelier',
 *   sizes TEXT[] NOT NULL DEFAULT ARRAY['Standard'],
 *   description TEXT NOT NULL,
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 *
 * 2. ORDERS TABLE
 * ----------------------------------------------------------------------------
 * CREATE TABLE IF NOT EXISTS public.orders (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   order_number TEXT UNIQUE NOT NULL,
 *   customer_name TEXT NOT NULL,
 *   customer_email TEXT NOT NULL,
 *   customer_phone TEXT NOT NULL,
 *   shipping_address TEXT NOT NULL,
 *   payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'Card', 'Razorpay', 'Stripe')),
 *   payment_reference TEXT NOT NULL,
 *   items JSONB NOT NULL,
 *   total_inr INTEGER NOT NULL CHECK (total_inr > 0),
 *   status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Crafting', 'Shipped', 'Delivered')),
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 *
 * 3. REVIEWS TABLE
 * ----------------------------------------------------------------------------
 * CREATE TABLE IF NOT EXISTS public.reviews (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
 *   author_name TEXT NOT NULL,
 *   author_location TEXT NOT NULL,
 *   rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
 *   comment TEXT NOT NULL,
 *   verified_buyer BOOLEAN NOT NULL DEFAULT true,
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 *
 * 4. ATOMIC STOCK DEDUCTION RPC
 * ----------------------------------------------------------------------------
 * CREATE OR REPLACE FUNCTION public.decrement_product_stock(p_id UUID, qty INTEGER)
 * RETURNS VOID AS $$
 * BEGIN
 *   UPDATE public.products
 *   SET stock = GREATEST(0, stock - qty)
 *   WHERE id = p_id;
 * END;
 * $$ LANGUAGE plpgsql SECURITY DEFINER;
 *
 * 5. ROW LEVEL SECURITY (RLS) POLICIES
 * ----------------------------------------------------------------------------
 * ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
 * CREATE POLICY "Admin manage products" ON public.products FOR ALL USING (auth.role() = 'authenticated');
 * CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
 * CREATE POLICY "Public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Authenticated insert orders" ON public.orders FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Admin read orders" ON public.orders FOR SELECT USING (true);
 *
 * 6. ENABLE SUPABASE REALTIME PUBLICATION
 * ----------------------------------------------------------------------------
 * ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
 * ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
 * ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
 * ============================================================================
 */

const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  '';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('YOUR_SUPABASE') &&
    !supabaseAnonKey.includes('YOUR_SUPABASE')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

/**
 * Subscribe to real-time INSERT / UPDATE / DELETE changes across products,
 * orders, and reviews when Supabase environment variables are present.
 * @param {Object} [handlers]
 * @param {(payload: any) => void} [handlers.onProductsChange]
 * @param {(payload: any) => void} [handlers.onOrdersChange]
 * @param {(payload: any) => void} [handlers.onReviewsChange]
 */
export function subscribeToStoreRealtime({
  onProductsChange,
  onOrdersChange,
  onReviewsChange,
} = {}) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('kala-karat-live-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
      onProductsChange?.(payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
      onOrdersChange?.(payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, (payload) => {
      onReviewsChange?.(payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
