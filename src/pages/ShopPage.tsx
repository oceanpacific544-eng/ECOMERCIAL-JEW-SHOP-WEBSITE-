import { ArrowUpDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../store/useStore';
import type { Category } from '../types/jewelry';

type FilterCategory = 'All' | Category;
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc';

const CATEGORIES: FilterCategory[] = [
  'All',
  'Necklaces',
  'Rings',
  'Earrings',
  'Bracelets',
];

export function ShopPage() {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = products.filter((item) => {
      const matchesCat =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        item.gemstones.toLowerCase().includes(query);
      return matchesCat && matchesQuery;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.priceInr - b.priceInr);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.priceInr - a.priceInr);
    }
    if (sortBy === 'rating-desc') {
      return [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [products, selectedCategory, sortBy, searchQuery]);

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="border-b border-[#1E1E1E]/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium tracking-wider text-[#9E7C3B]">
            Jaipur &amp; Mumbai Collections
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1E1E1E]">
            Handcrafted Fine Jewelry
          </h1>
          <p className="text-sm sm:text-base text-[#1E1E1E]/70 leading-relaxed">
            Small-batch 22k hallmarked gold, uncut Polki diamonds, and Zambian emeralds. Stock updates in real time as collectors acquire pieces.
          </p>
        </div>

        <p className="text-xs text-[#1E1E1E]/60 tabular-nums whitespace-nowrap">
          Showing {filteredProducts.length} of {products.length} pieces
        </p>
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Segmented Tabs */}
        <div
          role="tablist"
          aria-label="Filter by jewelry category"
          className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F1EBE0] rounded-lg self-start"
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#1B3B2B] text-[#FAF7F2] shadow-sm'
                    : 'text-[#1E1E1E]/75 hover:text-[#1E1E1E] hover:bg-white/60'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Search & Price Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#1E1E1E]/45 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Kundan, Polki, emerald..."
              aria-label="Search jewelry collection"
              className="w-full sm:w-64 pl-9 pr-3 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md text-[#1E1E1E] placeholder:text-[#1E1E1E]/45 focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          <div className="relative inline-flex items-center">
            <ArrowUpDown className="w-4 h-4 text-[#1E1E1E]/50 absolute left-3 pointer-events-none" />
            <select
              aria-label="Sort jewelry pieces"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full sm:w-auto pl-9 pr-8 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md text-[#1E1E1E] focus:outline-none focus:border-[#1B3B2B] cursor-pointer"
            >
              <option value="featured">Sort: Atelier Curated</option>
              <option value="price-asc">Price: Low to High (₹)</option>
              <option value="price-desc">Price: High to Low (₹)</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-[#1E1E1E]/10 rounded-lg p-12 text-center space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1E1E1E]">
            No matching pieces found
          </h2>
          <p className="text-sm text-[#1E1E1E]/65">
            Try clearing your search filter or switching to All collections.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setSortBy('featured');
            }}
            className="mt-2 px-5 py-2.5 text-sm font-medium bg-[#1B3B2B] text-[#FAF7F2] rounded-md hover:bg-[#142D20] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
