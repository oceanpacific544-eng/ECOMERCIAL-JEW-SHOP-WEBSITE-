import {
  CheckCircle2,
  CreditCard,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  Smartphone,
  Star,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ResilientImage } from '../components/ResilientImage';
import { formatInr } from '../data/seedData';
import { useStore } from '../store/useStore';
import type { Order, PaymentMethod } from '../types/jewelry';

export function CheckoutPage() {
  const {
    products,
    selectedProductSlug,
    setSelectedProductSlug,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    placeOrder,
    reviews,
    addReview,
    user,
    navigate,
  } = useStore();

  const product =
    products.find((p) => p.slug === selectedProductSlug) || products[0];

  const [selectedSize, setSelectedSize] = useState(
    product?.sizes[0] || 'Standard'
  );

  // Sync default size whenever active product changes
  useEffect(() => {
    if (product && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product?.id]);

  // Checkout state
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('+91 98201 54120');
  const [shippingAddress, setShippingAddress] = useState(
    '18 Altamount Road, Cumballa Hill, Mumbai 400026'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('collector@okicici');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8841');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('842');
  const [checkoutError, setCheckoutError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Review submission state
  const [reviewName, setReviewName] = useState(user?.name || '');
  const [reviewLocation, setReviewLocation] = useState('Mumbai, India');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  if (!product) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl font-semibold">Vault Empty</h1>
        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="px-5 py-2.5 bg-[#1B3B2B] text-[#FAF7F2] rounded-md text-sm font-medium cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const bagSubtotal = cart.reduce(
    (sum, item) => sum + item.priceInr * item.quantity,
    0
  );

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');

    if (cart.length === 0) {
      setCheckoutError('Please add at least one piece to your bag before paying.');
      return;
    }
    if (!customerName.trim() || !customerEmail.trim() || !shippingAddress.trim()) {
      setCheckoutError('Please complete your name, email, and insured delivery address.');
      return;
    }
    if (paymentMethod === 'UPI' && !upiId.includes('@')) {
      setCheckoutError('Please enter a valid UPI ID (e.g. name@okicici).');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const refMap: Record<PaymentMethod, string> = {
        UPI: `UPI/${Math.floor(100000000 + Math.random() * 899999999)}`,
        Card: `card_auth_${Math.floor(1000 + Math.random() * 8999)}`,
        Razorpay: `rzp_live_${Math.floor(100000 + Math.random() * 899999)}`,
        Stripe: `pi_kk_${Math.floor(100000 + Math.random() * 899999)}`,
      };

      const order = placeOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
        paymentReference: refMap[paymentMethod],
      });

      setIsProcessing(false);
      if (order) {
        setConfirmedOrder(order);
      }
    }, 600);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    if (!reviewName.trim() || reviewComment.trim().length < 8) {
      setReviewError('Please enter your name and a brief review (minimum 8 characters).');
      return;
    }
    addReview({
      productId: product.id,
      authorName: reviewName.trim(),
      authorLocation: reviewLocation.trim() || 'India',
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Piece Quick-Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1E1E1E]/10">
        <span className="text-xs font-medium text-[#1E1E1E]/55 whitespace-nowrap mr-2">
          Inspect Piece:
        </span>
        {products.map((p) => {
          const active = p.id === product.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedProductSlug(p.slug)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                active
                  ? 'bg-[#1B3B2B] text-[#FAF7F2]'
                  : 'bg-[#F1EBE0] text-[#1E1E1E]/75 hover:text-[#1E1E1E]'
              }`}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {/* 1. Contiguous Product Detail Module (Sticky Gallery Left + Purchase Module Right) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
          <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F1EBE0] border border-[#1E1E1E]/10">
            <ResilientImage
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs bg-white border border-[#1E1E1E]/10 rounded-lg p-4">
            <div>
              <p className="text-[#1E1E1E]/55">Gold Purity</p>
              <p className="font-semibold text-[#1E1E1E] mt-0.5">{product.karat}</p>
            </div>
            <div>
              <p className="text-[#1E1E1E]/55">Gross Weight</p>
              <p className="font-semibold text-[#1E1E1E] mt-0.5 tabular-nums">
                {product.weightGrams} g
              </p>
            </div>
            <div>
              <p className="text-[#1E1E1E]/55">Atelier Bench Time</p>
              <p className="font-semibold text-[#1E1E1E] mt-0.5 tabular-nums">
                {product.craftHours} hours
              </p>
            </div>
          </div>
        </div>

        {/* Right Purchase & Material Breakdown */}
        <div className="lg:col-span-5 space-y-6 bg-white border border-[#1E1E1E]/10 rounded-xl p-6 sm:p-8">
          <div className="space-y-2 border-b border-[#1E1E1E]/10 pb-5">
            <p className="text-xs text-[#9E7C3B] font-medium">
              {product.category} <span aria-hidden="true">·</span> {product.origin}
            </p>
            <h1 className="font-serif text-3xl font-semibold text-[#1E1E1E] leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center justify-between pt-1">
              <span className="font-serif text-2xl font-semibold text-[#1E1E1E] tabular-nums">
                {formatInr(product.priceInr)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1E1E1E]/80 tabular-nums">
                <Star className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <p className="text-sm text-[#1E1E1E]/80 leading-relaxed">
            {product.description}
          </p>

          {/* Material Breakdown */}
          <div className="space-y-2 text-xs bg-[#FAF7F2] rounded-lg p-4 border border-[#1E1E1E]/8">
            <div className="flex justify-between gap-4">
              <span className="text-[#1E1E1E]/60">Gemstones</span>
              <span className="font-medium text-[#1E1E1E] text-right">
                {product.gemstones}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#1E1E1E]/60">Vault Availability</span>
              <span
                className={`font-semibold tabular-nums ${
                  product.stock === 0
                    ? 'text-[#9E2A2B]'
                    : product.stock <= 3
                      ? 'text-[#9E7C3B]'
                      : 'text-[#1B3B2B]'
                }`}
              >
                {product.stock === 0
                  ? 'Sold Out'
                  : `Only ${product.stock} piece${product.stock > 1 ? 's' : ''} remaining`}
              </span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-[#1E1E1E]">
              Select Size / Fit
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#1B3B2B] text-[#FAF7F2] border-[#1B3B2B]'
                        : 'bg-white text-[#1E1E1E]/80 border-[#1E1E1E]/15 hover:border-[#1B3B2B]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Add to Bag */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={product.stock === 0}
              onClick={() => addToCart(product, selectedSize, 1)}
              className="w-full py-3.5 px-6 bg-[#1B3B2B] text-[#FAF7F2] text-sm font-semibold rounded-md hover:bg-[#142D20] disabled:bg-[#1E1E1E]/25 disabled:text-[#1E1E1E]/50 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {product.stock === 0
                ? 'Currently Out of Stock'
                : `Add to Bag · ${formatInr(product.priceInr)}`}
            </button>
            <p className="text-xs text-[#1E1E1E]/60 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1B3B2B] shrink-0" />
              <span>{product.craftNote}</span>
            </p>
          </div>
        </div>
      </section>

      {/* 2. Integrated Bag & Payment Gateway Checkout */}
      <section
        id="integrated-checkout"
        className="border-t border-[#1E1E1E]/10 pt-14 space-y-8"
      >
        <div>
          <p className="text-xs font-medium tracking-wider text-[#9E7C3B]">
            Insured Atelier Checkout
          </p>
          <h2 className="font-serif text-3xl font-semibold text-[#1E1E1E] mt-1">
            Your Bag &amp; Payment Gateway
          </h2>
        </div>

        {confirmedOrder ? (
          <div className="bg-[#1B3B2B] text-[#FAF7F2] rounded-xl p-8 sm:p-10 space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-[#C5A059] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs text-[#C5A059] font-medium">
                  Payment Verified · {confirmedOrder.paymentMethod} ({confirmedOrder.paymentReference})
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold">
                  Order {confirmedOrder.orderNumber} Confirmed — Preparing Shipment
                </h3>
                <p className="text-sm text-[#FAF7F2]/80">
                  Vault stock has been updated and your order has been recorded in the Admin Revenue Ledger.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#FAF7F2]/15 text-sm">
              <div className="space-y-2">
                <p className="text-xs text-[#C5A059] font-semibold">Recipient &amp; Dispatch</p>
                <p>{confirmedOrder.customerName}</p>
                <p className="text-[#FAF7F2]/80">{confirmedOrder.customerEmail}</p>
                <p className="text-[#FAF7F2]/80">{confirmedOrder.shippingAddress}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-[#C5A059] font-semibold">Pieces Acquired</p>
                {confirmedOrder.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.selectedSize}`}
                    className="flex justify-between gap-4"
                  >
                    <span>
                      {item.name} ({item.selectedSize}) × {item.quantity}
                    </span>
                    <span className="tabular-nums font-medium">
                      {formatInr(item.priceInr * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#FAF7F2]/15 flex justify-between font-semibold text-base">
                  <span>Total Paid</span>
                  <span className="tabular-nums text-[#C5A059]">
                    {formatInr(confirmedOrder.totalInr)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmedOrder(null);
                  navigate('/shop');
                }}
                className="px-5 py-2.5 bg-[#C5A059] text-[#1E1E1E] text-sm font-semibold rounded-md hover:bg-[#d3b16d] transition-colors cursor-pointer"
              >
                Continue Exploring Collections
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-5 py-2.5 border border-[#FAF7F2]/30 text-[#FAF7F2] text-sm font-medium rounded-md hover:bg-[#FAF7F2]/10 transition-colors cursor-pointer"
              >
                View Order in Admin Dashboard
              </button>
              <button
                type="button"
                onClick={() => navigate('/company')}
                className="px-5 py-2.5 border border-[#FAF7F2]/30 text-[#FAF7F2] text-sm font-medium rounded-md hover:bg-[#FAF7F2]/10 transition-colors cursor-pointer"
              >
                HAPPYNESSLO Customer Care
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Bag Summary */}
            <div className="lg:col-span-5 bg-white border border-[#1E1E1E]/10 rounded-xl p-6 space-y-5">
              <h3 className="font-serif text-xl font-semibold text-[#1E1E1E]">
                Order Summary
              </h3>

              {cart.length === 0 ? (
                <div className="py-8 text-center space-y-3 border border-dashed border-[#1E1E1E]/15 rounded-lg p-5">
                  <p className="text-sm text-[#1E1E1E]/70">
                    Your bag is empty. Add {product.name} above or select pieces from the Shop.
                  </p>
                  <button
                    type="button"
                    disabled={product.stock === 0}
                    onClick={() => addToCart(product, selectedSize, 1)}
                    className="px-4 py-2 text-xs font-semibold bg-[#1B3B2B] text-[#FAF7F2] rounded-md hover:bg-[#142D20] cursor-pointer disabled:opacity-40"
                  >
                    Add {product.name} Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.productId}-${item.selectedSize}`}
                      className="flex gap-3.5 pb-4 border-b border-[#1E1E1E]/10"
                    >
                      <div className="w-20 h-16 rounded-md overflow-hidden bg-[#F1EBE0] shrink-0">
                        <ResilientImage
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-serif text-sm font-semibold text-[#1E1E1E] truncate">
                            {item.name}
                          </p>
                          <button
                            type="button"
                            aria-label={`Remove ${item.name}`}
                            onClick={() =>
                              removeFromCart(item.productId, item.selectedSize)
                            }
                            className="text-[#1E1E1E]/45 hover:text-[#9E2A2B] cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-[#1E1E1E]/60">{item.selectedSize}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center border border-[#1E1E1E]/15 rounded">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateCartQuantity(item.productId, item.selectedSize, -1)
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-[#F1EBE0] cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateCartQuantity(item.productId, item.selectedSize, 1)
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-[#F1EBE0] cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold tabular-nums">
                            {formatInr(item.priceInr * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-2 pt-1 text-sm">
                    <div className="flex justify-between text-[#1E1E1E]/70">
                      <span>Armoured Transit Insurance</span>
                      <span className="text-[#1B3B2B] font-medium">Complimentary</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t border-[#1E1E1E]/10">
                      <span>Total Payable</span>
                      <span className="font-serif text-xl tabular-nums">
                        {formatInr(bagSubtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Delivery & Payment Gateway Simulation */}
            <form
              onSubmit={handleCheckoutSubmit}
              className="lg:col-span-7 bg-white border border-[#1E1E1E]/10 rounded-xl p-6 sm:p-8 space-y-6"
            >
              <h3 className="font-serif text-xl font-semibold text-[#1E1E1E]">
                Collector Details &amp; Payment
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ananya Deshmukh"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1.5">
                    Email for Receipt &amp; Certificate
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="collector@domain.in"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1.5">
                    Mobile Number (Insured OTP Delivery)
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1.5">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>
              </div>

              {/* Payment Gateway Selector */}
              <div className="space-y-3 pt-2 border-t border-[#1E1E1E]/10">
                <label className="block text-xs font-semibold text-[#1E1E1E]">
                  Select Payment Gateway
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['UPI', 'Card', 'Razorpay', 'Stripe'] as PaymentMethod[]).map(
                    (method) => {
                      const active = paymentMethod === method;
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`py-2.5 px-3 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#1B3B2B] text-[#FAF7F2] border-[#1B3B2B]'
                              : 'bg-[#FAF7F2] text-[#1E1E1E]/80 border-[#1E1E1E]/15 hover:border-[#1B3B2B]'
                          }`}
                        >
                          {method}
                        </button>
                      );
                    }
                  )}
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="bg-[#FAF7F2] border border-[#1E1E1E]/10 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#1B3B2B]">
                      <Smartphone className="w-4 h-4" />
                      <span>Instant UPI Collect / BHIM / GPay</span>
                    </div>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@okicici"
                      aria-label="UPI ID"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
                    />
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="bg-[#FAF7F2] border border-[#1E1E1E]/10 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-[#1E1E1E]/65 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#1E1E1E]/65 mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#1E1E1E]/65 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md tabular-nums"
                      />
                    </div>
                  </div>
                )}

                {(paymentMethod === 'Razorpay' || paymentMethod === 'Stripe') && (
                  <div className="bg-[#FAF7F2] border border-[#1E1E1E]/10 rounded-lg p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-[#1B3B2B]" />
                      <div className="text-xs">
                        <p className="font-semibold text-[#1E1E1E]">
                          {paymentMethod} Encrypted Vault Checkout
                        </p>
                        <p className="text-[#1E1E1E]/65">
                          Supports NetBanking, Amex, Visa Infinite &amp; Zero-Cost EMI.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {checkoutError && (
                <p role="alert" className="text-xs font-medium text-[#9E2A2B]">
                  {checkoutError}
                </p>
              )}

              <button
                type="submit"
                disabled={isProcessing || cart.length === 0}
                className="w-full py-3.5 px-6 bg-[#1B3B2B] text-[#FAF7F2] text-sm font-semibold rounded-md hover:bg-[#142D20] disabled:opacity-45 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4 text-[#C5A059]" />
                <span>
                  {isProcessing
                    ? 'Authorizing Payment...'
                    : `Complete Payment · ${formatInr(bagSubtotal)}`}
                </span>
              </button>
            </form>
          </div>
        )}
      </section>

      {/* 3. Live Verified Buyer Reviews & Submission */}
      <section className="border-t border-[#1E1E1E]/10 pt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <p className="text-xs font-medium tracking-wider text-[#9E7C3B]">
              Collector Feedback
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E1E1E] mt-1">
              Verified Reviews for {product.name}
            </h2>
          </div>

          {productReviews.length === 0 ? (
            <p className="text-sm text-[#1E1E1E]/65 bg-white border border-[#1E1E1E]/10 rounded-lg p-6">
              No reviews submitted for this piece yet. Be the first collector to share your experience.
            </p>
          ) : (
            <div className="space-y-4">
              {productReviews.map((rev) => (
                <article
                  key={rev.id}
                  className="bg-white border border-[#1E1E1E]/10 rounded-lg p-5 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'fill-[#C5A059] text-[#C5A059]'
                              : 'text-[#1E1E1E]/20'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[#1B3B2B] font-medium tabular-nums">
                      Verified Buyer · {rev.createdAt}
                    </span>
                  </div>
                  <p className="text-sm text-[#1E1E1E]/85 leading-relaxed">
                    “{rev.comment}”
                  </p>
                  <p className="text-xs text-[#1E1E1E]/60 font-medium">
                    {rev.authorName} · {rev.authorLocation}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Submit Review Form */}
        <form
          onSubmit={handleReviewSubmit}
          className="lg:col-span-5 bg-white border border-[#1E1E1E]/10 rounded-xl p-6 sm:p-7 space-y-4 self-start"
        >
          <h3 className="font-serif text-xl font-semibold text-[#1E1E1E]">
            Leave a Verified Review
          </h3>
          <p className="text-xs text-[#1E1E1E]/65">
            Your rating and commentary publish immediately to the {product.name} listing and Home reviews carousel.
          </p>

          <div>
            <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1.5">
              Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} stars`}
                  onClick={() => setReviewRating(star)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      star <= reviewRating
                        ? 'fill-[#C5A059] text-[#C5A059]'
                        : 'text-[#1E1E1E]/25'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              placeholder="e.g. Nandini Rao"
              className="w-full px-3.5 py-2 text-sm border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1">
              City
            </label>
            <input
              type="text"
              value={reviewLocation}
              onChange={(e) => setReviewLocation(e.target.value)}
              placeholder="e.g. Hyderabad, Telangana"
              className="w-full px-3.5 py-2 text-sm border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1">
              Review
            </label>
            <textarea
              rows={3}
              required
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share details on finish, stone brilliance, or fit..."
              className="w-full px-3.5 py-2 text-sm border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          {reviewError && (
            <p className="text-xs text-[#9E2A2B] font-medium">{reviewError}</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#1B3B2B] text-[#FAF7F2] text-sm font-medium rounded-md hover:bg-[#142D20] transition-colors cursor-pointer"
          >
            Publish Review
          </button>
        </form>
      </section>
    </div>
  );
}
