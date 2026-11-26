import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatInr } from '../data/seedData';
import { useStore } from '../store/useStore';
import { ResilientImage } from './ResilientImage';

export function CartDrawer() {
  const {
    isCartOpen,
    setCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    navigate,
  } = useStore();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.priceInr * item.quantity, 0);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1E1E1E]/45 backdrop-blur-[2px] transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 w-full max-w-md bg-[#FAF7F2] h-full flex flex-col border-l border-[#1E1E1E]/10 shadow-2xl">
        <div className="px-6 py-5 border-b border-[#1E1E1E]/10 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#1E1E1E]">
              Your Atelier Bag
            </h2>
            <p className="text-xs text-[#1E1E1E]/60 mt-0.5 tabular-nums">
              {totalCount} {totalCount === 1 ? 'heirloom piece' : 'heirloom pieces'} · Insured courier included
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close bag"
            className="w-10 h-10 flex items-center justify-center rounded-md text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:bg-[#F1EBE0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <ShoppingBag className="w-10 h-10 text-[#C5A059] mb-4" strokeWidth={1.4} />
              <h3 className="font-serif text-lg font-medium text-[#1E1E1E]">
                Your bag is currently empty
              </h3>
              <p className="text-sm text-[#1E1E1E]/65 mt-2 max-w-xs leading-relaxed">
                Explore our Jaipur and Mumbai handmade collections to select a piece.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  navigate('/shop');
                }}
                className="mt-6 px-5 py-2.5 text-sm font-medium bg-[#1B3B2B] text-[#FAF7F2] rounded-md hover:bg-[#142D20] transition-colors cursor-pointer"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.selectedSize}`}
                className="flex gap-4 pb-5 border-b border-[#1E1E1E]/10"
              >
                <div className="w-24 h-20 rounded-md overflow-hidden bg-[#F1EBE0] shrink-0">
                  <ResilientImage
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-sm font-semibold text-[#1E1E1E] truncate">
                      {item.name}
                    </h3>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeFromCart(item.productId, item.selectedSize)}
                      className="text-[#1E1E1E]/45 hover:text-[#9E2A2B] transition-colors cursor-pointer p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[#1E1E1E]/60 mt-0.5 truncate">
                    {item.category} · {item.selectedSize}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center border border-[#1E1E1E]/15 rounded-md bg-white/70">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateCartQuantity(item.productId, item.selectedSize, -1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-[#1E1E1E]/80 hover:bg-[#F1EBE0] transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          updateCartQuantity(item.productId, item.selectedSize, 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-[#1E1E1E]/80 hover:bg-[#F1EBE0] transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-[#1E1E1E] tabular-nums">
                      {formatInr(item.priceInr * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[#1E1E1E]/10 bg-[#F1EBE0]/60 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#1E1E1E]/75">Subtotal (Incl. 3% GST)</span>
              <span className="font-serif text-lg font-semibold text-[#1E1E1E] tabular-nums">
                {formatInr(subtotal)}
              </span>
            </div>
            <p className="text-xs text-[#1E1E1E]/60">
              Complimentary armoured transit insurance &amp; BIS 916 hallmark certificate.
            </p>
            <button
              type="button"
              onClick={() => {
                setCartOpen(false);
                navigate('/checkout');
              }}
              className="w-full py-3 px-5 bg-[#1B3B2B] text-[#FAF7F2] text-sm font-medium rounded-md hover:bg-[#142D20] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
