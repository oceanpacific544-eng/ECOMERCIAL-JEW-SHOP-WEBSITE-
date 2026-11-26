export type Category = 'Necklaces' | 'Rings' | 'Earrings' | 'Bracelets';

export type RoutePath = '/' | '/shop' | '/craft' | '/company' | '/checkout' | '/login' | '/admin';

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: Category;
  priceInr: number;
  stock: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  isSignature: boolean;
  karat: string;
  gemstones: string;
  weightGrams: number;
  craftHours: number;
  origin: string;
  sizes: string[];
  description: string;
  craftNote: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  authorName: string;
  authorLocation: string;
  rating: number;
  comment: string;
  verifiedBuyer: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  subtitle: string;
  category: Category;
  priceInr: number;
  imageUrl: string;
  selectedSize: string;
  quantity: number;
}

export type PaymentMethod = 'UPI' | 'Card' | 'Razorpay' | 'Stripe';

export interface OrderItemSummary {
  productId: string;
  name: string;
  selectedSize: string;
  quantity: number;
  priceInr: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  items: OrderItemSummary[];
  totalInr: number;
  status: 'Confirmed' | 'Crafting' | 'Shipped' | 'Delivered';
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: 'email' | 'google' | 'magic-link';
  role: 'collector' | 'admin';
}

export interface CraftGalleryItem {
  id: string;
  title: string;
  technique: string;
  artisan: string;
  workshop: string;
  imageUrl: string;
  aspect: 'tall' | 'wide' | 'square';
  caption: string;
}

export interface CraftFilm {
  id: string;
  title: string;
  duration: string;
  artisan: string;
  location: string;
  thumbnailUrl: string;
  summary: string;
  chapters: {
    timeLabel: string;
    heading: string;
    detail: string;
    imageUrl: string;
  }[];
}

export type SupportTopic =
  | 'Order & Insured Shipping'
  | 'Resizing & Repair'
  | 'Private Boutique Visit'
  | 'Hallmark & Appraisal'
  | 'Custom Bridal Commission';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  topic: SupportTopic;
  orderNumber?: string;
  message: string;
  status: 'Open' | 'In Review' | 'Resolved';
  createdAt: string;
}
