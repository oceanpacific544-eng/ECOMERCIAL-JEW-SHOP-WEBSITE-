import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_SUPPORT_TICKETS,
} from '../data/seedData';
import type {
  AuthUser,
  CartItem,
  Category,
  Order,
  PaymentMethod,
  Product,
  Review,
  RoutePath,
  SupportTicket,
  SupportTopic,
} from '../types/jewelry';

interface StoreState {
  // Navigation & UI drawers
  currentRoute: RoutePath;
  selectedProductSlug: string;
  isCartOpen: boolean;
  toastMessage: string | null;

  // Core Domain Entities (Synced across all pages)
  products: Product[];
  reviews: Review[];
  orders: Order[];
  supportTickets: SupportTicket[];
  cart: CartItem[];
  user: AuthUser | null;

  // Navigation Actions
  navigate: (path: RoutePath, options?: { productSlug?: string }) => void;
  setSelectedProductSlug: (slug: string) => void;
  setCartOpen: (open: boolean) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;

  // Cart Actions
  addToCart: (product: Product, selectedSize?: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, selectedSize: string, delta: number) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  clearCart: () => void;

  // Checkout & Stock Deduction
  placeOrder: (payload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: PaymentMethod;
    paymentReference: string;
  }) => Order | null;

  // Reviews
  addReview: (payload: {
    productId: string;
    authorName: string;
    authorLocation: string;
    rating: number;
    comment: string;
  }) => void;

  // Admin Inventory & Catalog Actions
  adjustProductStock: (productId: string, delta: number) => void;
  deleteProduct: (productId: string) => void;
  addProduct: (input: {
    name: string;
    subtitle: string;
    category: Category;
    priceInr: number;
    stock: number;
    karat: string;
    gemstones: string;
    weightGrams: number;
    craftHours: number;
    origin: string;
    imageUrl: string;
    description: string;
  }) => Product;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Customer Care Support Actions
  submitSupportTicket: (payload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    topic: SupportTopic;
    orderNumber?: string;
    message: string;
  }) => SupportTicket;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;

  // Auth Actions
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const VALID_ROUTES: RoutePath[] = [
  '/',
  '/shop',
  '/craft',
  '/company',
  '/checkout',
  '/login',
  '/admin',
];

function getInitialRoute(): RoutePath {
  if (typeof window === 'undefined') return '/';
  const pathname = window.location.pathname as RoutePath;
  return VALID_ROUTES.includes(pathname) ? pathname : '/';
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentRoute: getInitialRoute(),
      selectedProductSlug: INITIAL_PRODUCTS[0].slug,
      isCartOpen: false,
      toastMessage: null,

      products: INITIAL_PRODUCTS,
      reviews: INITIAL_REVIEWS,
      orders: INITIAL_ORDERS,
      supportTickets: INITIAL_SUPPORT_TICKETS,
      cart: [],
      user: null,

      navigate: (path, options) => {
        if (options?.productSlug) {
          set({ selectedProductSlug: options.productSlug });
        }
        set({ currentRoute: path, isCartOpen: false });
        if (typeof window !== 'undefined') {
          const url = options?.productSlug
            ? `${path}?piece=${encodeURIComponent(options.productSlug)}`
            : path;
          window.history.pushState({ path }, '', url);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      setSelectedProductSlug: (slug) => set({ selectedProductSlug: slug }),
      setCartOpen: (open) => set({ isCartOpen: open }),

      showToast: (msg) => {
        set({ toastMessage: msg });
        setTimeout(() => {
          if (get().toastMessage === msg) {
            set({ toastMessage: null });
          }
        }, 3400);
      },
      clearToast: () => set({ toastMessage: null }),

      addToCart: (product, selectedSize, quantity = 1) => {
        if (product.stock <= 0) {
          get().showToast(`${product.name} is currently out of stock.`);
          return;
        }
        const sizeToUse = selectedSize || product.sizes[0] || 'Standard';
        const existing = get().cart.find(
          (item) => item.productId === product.id && item.selectedSize === sizeToUse
        );

        const currentQtyInCart = get()
          .cart.filter((i) => i.productId === product.id)
          .reduce((sum, i) => sum + i.quantity, 0);

        if (currentQtyInCart + quantity > product.stock) {
          get().showToast(`Only ${product.stock} piece(s) of ${product.name} available.`);
          return;
        }

        if (existing) {
          set({
            cart: get().cart.map((item) =>
              item.productId === product.id && item.selectedSize === sizeToUse
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            isCartOpen: true,
          });
        } else {
          set({
            cart: [
              ...get().cart,
              {
                productId: product.id,
                name: product.name,
                subtitle: product.subtitle,
                category: product.category,
                priceInr: product.priceInr,
                imageUrl: product.imageUrl,
                selectedSize: sizeToUse,
                quantity,
              },
            ],
            isCartOpen: true,
          });
        }
        get().showToast(`Added ${product.name} to your bag.`);
      },

      updateCartQuantity: (productId, selectedSize, delta) => {
        const product = get().products.find((p) => p.id === productId);
        const maxStock = product ? product.stock : 99;

        const nextCart = get()
          .cart.map((item) => {
            if (item.productId === productId && item.selectedSize === selectedSize) {
              const nextQty = item.quantity + delta;
              if (nextQty <= 0) return null;
              if (nextQty > maxStock) {
                get().showToast(`Only ${maxStock} piece(s) left in atelier vault.`);
                return item;
              }
              return { ...item, quantity: nextQty };
            }
            return item;
          })
          .filter(Boolean) as CartItem[];

        set({ cart: nextCart });
      },

      removeFromCart: (productId, selectedSize) => {
        set({
          cart: get().cart.filter(
            (item) => !(item.productId === productId && item.selectedSize === selectedSize)
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      placeOrder: (payload) => {
        const currentCart = get().cart;
        if (currentCart.length === 0) return null;

        const totalInr = currentCart.reduce(
          (sum, item) => sum + item.priceInr * item.quantity,
          0
        );
        const nextNum = 1045 + get().orders.length;
        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          orderNumber: `KK-${nextNum}`,
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          customerPhone: payload.customerPhone,
          shippingAddress: payload.shippingAddress,
          paymentMethod: payload.paymentMethod,
          paymentReference: payload.paymentReference,
          items: currentCart.map((c) => ({
            productId: c.productId,
            name: c.name,
            selectedSize: c.selectedSize,
            quantity: c.quantity,
            priceInr: c.priceInr,
          })),
          totalInr,
          status: 'Confirmed',
          createdAt: new Date().toISOString(),
        };

        // Deduct stock counts automatically in real time across all 6 pages
        const updatedProducts = get().products.map((prod) => {
          const orderedQty = currentCart
            .filter((item) => item.productId === prod.id)
            .reduce((sum, item) => sum + item.quantity, 0);
          if (orderedQty === 0) return prod;
          return {
            ...prod,
            stock: Math.max(0, prod.stock - orderedQty),
          };
        });

        set({
          products: updatedProducts,
          orders: [newOrder, ...get().orders],
          cart: [],
          isCartOpen: false,
        });

        get().showToast(`Order ${newOrder.orderNumber} confirmed.`);
        return newOrder;
      },

      addReview: (payload) => {
        const product = get().products.find((p) => p.id === payload.productId);
        if (!product) return;

        const newReview: Review = {
          id: `rev-${Date.now()}`,
          productId: payload.productId,
          productName: product.name,
          authorName: payload.authorName,
          authorLocation: payload.authorLocation || 'India',
          rating: payload.rating,
          comment: payload.comment,
          verifiedBuyer: true,
          createdAt: new Date().toISOString().split('T')[0],
        };

        const updatedReviews = [newReview, ...get().reviews];
        const productReviews = updatedReviews.filter((r) => r.productId === payload.productId);
        const avg =
          productReviews.reduce((acc, r) => acc + r.rating, 0) /
          Math.max(1, productReviews.length);

        const updatedProducts = get().products.map((p) =>
          p.id === payload.productId
            ? {
                ...p,
                rating: Number(avg.toFixed(1)),
                reviewCount: p.reviewCount + 1,
              }
            : p
        );

        set({
          reviews: updatedReviews,
          products: updatedProducts,
        });
        get().showToast('Thank you — your verified review is now live.');
      },

      adjustProductStock: (productId, delta) => {
        set({
          products: get().products.map((p) =>
            p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
          ),
        });
      },

      deleteProduct: (productId) => {
        const remaining = get().products.filter((p) => p.id !== productId);
        const currentSlug = get().selectedProductSlug;
        const deletedItem = get().products.find((p) => p.id === productId);

        set({
          products: remaining,
          cart: get().cart.filter((c) => c.productId !== productId),
          selectedProductSlug:
            deletedItem && deletedItem.slug === currentSlug && remaining.length > 0
              ? remaining[0].slug
              : currentSlug,
        });
        get().showToast('Jewelry piece removed from catalog.');
      },

      addProduct: (input) => {
        const slug =
          input.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') +
          '-' +
          Math.floor(100 + Math.random() * 900);

        const defaultSizes: Record<Category, string[]> = {
          Necklaces: ['15" Collar', '16" Classic', '18" Matinee'],
          Rings: ['India 12', 'India 14', 'India 16', 'India 18'],
          Earrings: ['Standard Post & Push-Back', 'Screw-Back Heritage Post'],
          Bracelets: ['2.2 Anna (Small)', '2.4 Anna (Medium)', '2.6 Anna (Large)'],
        };

        const newProduct: Product = {
          id: `kk-prod-${Date.now()}`,
          slug,
          name: input.name,
          subtitle: input.subtitle,
          category: input.category,
          priceInr: input.priceInr,
          stock: input.stock,
          rating: 5.0,
          reviewCount: 0,
          imageUrl: input.imageUrl,
          isSignature: false,
          karat: input.karat,
          gemstones: input.gemstones,
          weightGrams: input.weightGrams,
          craftHours: input.craftHours,
          origin: input.origin,
          sizes: defaultSizes[input.category],
          description: input.description,
          craftNote: 'Includes signed karigar provenance card & BIS 916 hallmark.',
        };

        set({
          products: [newProduct, ...get().products],
        });
        get().showToast(`${newProduct.name} published to Shop.`);
        return newProduct;
      },

      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        });
      },

      submitSupportTicket: (payload) => {
        const nextNum = 2001 + get().supportTickets.length;
        const newTicket: SupportTicket = {
          id: `sup-${Date.now()}`,
          ticketNumber: `CARE-${nextNum}`,
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          customerPhone: payload.customerPhone,
          topic: payload.topic,
          orderNumber: payload.orderNumber || undefined,
          message: payload.message,
          status: 'Open',
          createdAt: new Date().toISOString().split('T')[0],
        };
        set({
          supportTickets: [newTicket, ...get().supportTickets],
        });
        get().showToast(`Support ticket ${newTicket.ticketNumber} received by HAPPYNESSLO Care.`);
        return newTicket;
      },

      updateTicketStatus: (ticketId, status) => {
        set({
          supportTickets: get().supportTickets.map((t) =>
            t.id === ticketId ? { ...t, status } : t
          ),
        });
      },

      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null });
        get().showToast('Signed out of Kala & Karat.');
      },
    }),
    {
      name: 'kala-karat-atelier-v2',
      partialize: (state) => ({
        products: state.products,
        reviews: state.reviews,
        orders: state.orders,
        supportTickets: state.supportTickets,
        cart: state.cart,
        user: state.user,
      }),
    }
  )
);
