import { Plus, Star } from 'lucide-react';
import { formatInr } from '../data/seedData';
import { useStore } from '../store/useStore';
import type { Product } from '../types/jewelry';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, navigate } = useStore();

  const stockLabel =
    product.stock === 0
      ? 'Sold out'
      : product.stock <= 3
        ? `Only ${product.stock} left`
        : `${product.stock} in vault`;

  return (
    <article className="group flex flex-col bg-white border border-[#1E1E1E]/10 rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Media Zone (65–75% visual presence, uniform 4:3 framing) */}
      <button
        type="button"
        onClick={() => navigate('/checkout', { productSlug: product.slug })}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#F1EBE0] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1B3B2B]"
      >
        <ResilientImage
          src={product.imageUrl}
          alt={product.name}
          fallbackLabel={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </button>

      {/* Clean Content Zone (Identical field order across all cards) */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-[#1E1E1E]/60 mb-1.5">
            <span>
              {product.category} <span aria-hidden="true">·</span>{' '}
              <span
                className={
                  product.stock <= 3 && product.stock > 0
                    ? 'text-[#9E7C3B] font-medium'
                    : product.stock === 0
                      ? 'text-[#9E2A2B] font-medium'
                      : ''
                }
              >
                {stockLabel}
              </span>
            </span>
            <span className="inline-flex items-center gap-1 text-[#1E1E1E]/80 tabular-nums shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
              <span>{product.rating.toFixed(1)}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout', { productSlug: product.slug })}
            className="text-left cursor-pointer group-hover:text-[#1B3B2B] transition-colors"
          >
            <h3 className="font-serif text-lg font-semibold text-[#1E1E1E] leading-snug">
              {product.name}
            </h3>
          </button>
          <p className="text-xs text-[#1E1E1E]/65 mt-1 line-clamp-1">{product.subtitle}</p>
        </div>

        <div className="pt-3 border-t border-[#1E1E1E]/8 flex items-center justify-between gap-3">
          <span className="text-base font-semibold text-[#1E1E1E] tabular-nums">
            {formatInr(product.priceInr)}
          </span>

          <button
            type="button"
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md bg-[#1B3B2B] text-[#FAF7F2] hover:bg-[#142D20] disabled:bg-[#1E1E1E]/20 disabled:text-[#1E1E1E]/50 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{product.stock === 0 ? 'Sold Out' : 'Quick Add'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
