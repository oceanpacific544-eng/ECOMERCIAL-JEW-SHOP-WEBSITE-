import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ResilientImage } from '../components/ResilientImage';
import { formatInr } from '../data/seedData';
import { useStore } from '../store/useStore';

export function HomePage() {
  const { products, reviews, navigate } = useStore();

  // 5 signature handmade pieces for Hero Carousel
  const signatureSlides = products.filter((p) => p.isSignature).slice(0, 5);
  const heroSlides = signatureSlides.length > 0 ? signatureSlides : products.slice(0, 5);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    if (isPaused || heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, heroSlides.length]);

  const safeSlideIndex = activeSlide % Math.max(1, heroSlides.length);
  const currentHero = heroSlides[safeSlideIndex];

  const featuredProducts = products.slice(0, 6);

  const visibleReviewCount = 3;
  const maxReviewStart = Math.max(0, reviews.length - 1);
  const currentReviews =
    reviews.length <= visibleReviewCount
      ? reviews
      : Array.from({ length: visibleReviewCount }).map(
          (_, offset) => reviews[(reviewIndex + offset) % reviews.length]
        );

  return (
    <div className="space-y-20 pb-8">
      {/* 1. Full-Width Responsive 5-Slide Hero Carousel */}
      <section
        aria-label="Signature Heirloom Showcase"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full bg-[#1B3B2B] text-[#FAF7F2] overflow-hidden"
      >
        <div className="relative h-[520px] sm:h-[580px] lg:h-[640px] max-w-[1440px] mx-auto">
          {heroSlides.map((slide, idx) => {
            const isCurrent = idx === safeSlideIndex;
            return (
              <div
                key={slide.id}
                aria-hidden={!isCurrent}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <ResilientImage
                  src={slide.imageUrl}
                  alt={slide.name}
                  className="w-full h-full object-cover object-center"
                />
                {/* Measured Scrim for WCAG AA Contrast */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#12261C]/90 via-[#12261C]/45 to-[#12261C]/15"
                />
              </div>
            );
          })}

          {/* Hero Foreground Copy & Controls */}
          {currentHero && (
            <div className="relative z-20 h-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16">
              <div className="max-w-2xl space-y-4">
                <p className="text-xs sm:text-sm font-medium tracking-wider text-[#C5A059]">
                  Signature Piece 0{safeSlideIndex + 1} of 0{heroSlides.length}{' '}
                  <span aria-hidden="true">·</span> {currentHero.origin}
                </p>
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.1] text-[#FAF7F2] [text-wrap:balance]">
                  {currentHero.name}
                </h1>
                <p className="text-sm sm:text-base text-[#FAF7F2]/85 max-w-xl leading-relaxed">
                  {currentHero.subtitle} — {currentHero.karat}. Crafted over{' '}
                  <span className="tabular-nums">{currentHero.craftHours}</span> bench hours.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-5">
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/checkout', { productSlug: currentHero.slug })
                    }
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#C5A059] text-[#1E1E1E] text-sm font-semibold rounded-md hover:bg-[#d3b16d] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Shop Piece</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="font-serif text-xl sm:text-2xl text-[#FAF7F2] tabular-nums">
                    {formatInr(currentHero.priceInr)}
                  </span>
                </div>
              </div>

              {/* Carousel Prev/Next Arrows & Dot Indicators */}
              <div className="mt-8 flex items-center justify-between border-t border-[#FAF7F2]/15 pt-5">
                <div className="flex items-center gap-2.5" role="tablist" aria-label="Slide selector">
                  {heroSlides.map((slide, idx) => {
                    const active = idx === safeSlideIndex;
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-label={`View ${slide.name}`}
                        onClick={() => setActiveSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          active
                            ? 'w-8 bg-[#C5A059]'
                            : 'w-2.5 bg-[#FAF7F2]/40 hover:bg-[#FAF7F2]/70'
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous signature piece"
                    onClick={() =>
                      setActiveSlide(
                        (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
                      )
                    }
                    className="w-10 h-10 rounded-md border border-[#FAF7F2]/25 flex items-center justify-center text-[#FAF7F2] hover:bg-[#FAF7F2]/15 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next signature piece"
                    onClick={() =>
                      setActiveSlide((prev) => (prev + 1) % heroSlides.length)
                    }
                    className="w-10 h-10 rounded-md border border-[#FAF7F2]/25 flex items-center justify-center text-[#FAF7F2] hover:bg-[#FAF7F2]/15 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. The Psychology of Craft & Color Trust Section */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-[#1B3B2B] text-[#FAF7F2] p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-medium tracking-wider text-[#C5A059]">
              Material Philosophy
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight [text-wrap:balance]">
              The Psychology of Craft &amp; Color
            </h2>
            <p className="text-sm sm:text-base text-[#FAF7F2]/80 leading-relaxed">
              Every Kala &amp; Karat creation balances two enduring visual anchors — deep Zambian emerald tones and hand-burnished 22k gold — selected to quiet the eye and honour generational permanence.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/craft')}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#C5A059] hover:text-[#FAF7F2] transition-colors cursor-pointer"
              >
                <span>Explore the Jaipur &amp; Mumbai Ateliers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-[#FAF7F2]/[0.06] border border-[#FAF7F2]/15 space-y-3">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="w-9 h-9 rounded-md bg-[#12261C] border border-[#FAF7F2]/25 flex items-center justify-center shrink-0"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#FAF7F2]">
                  Deep Emerald · Trust &amp; Calm
                </h3>
              </div>
              <p className="text-sm text-[#FAF7F2]/80 leading-relaxed">
                Rooted in natural Zambian beryl and kiln-fired meenakari, deep forest emerald lowers visual noise, evokes quiet confidence, and signals unhurried provenance before a single carat is weighed.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-[#FAF7F2]/[0.06] border border-[#FAF7F2]/15 space-y-3">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="w-9 h-9 rounded-md bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#FAF7F2]">
                  Brushed 22k Gold · Heirloom Value
                </h3>
              </div>
              <p className="text-sm text-[#FAF7F2]/80 leading-relaxed">
                Unlike mirror-plated alloys, warm satin-hammered 22k gold absorbs harsh glare and radiates organic memory—a tangible store of family history crafted to outlast trends by decades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Best-Sellers Grid */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1E1E1E]/10 pb-5">
          <div>
            <p className="text-xs font-medium tracking-wider text-[#9E7C3B]">
              Curated Vault Selection
            </p>
            <h2 className="font-serif text-3xl font-semibold text-[#1E1E1E] mt-1">
              Featured Best-Sellers
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1B3B2B] hover:underline underline-offset-4 cursor-pointer self-start sm:self-auto"
          >
            <span>View All {products.length} Pieces</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Verified Customer Reviews Carousel */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1E1E1E]/10 pb-5">
          <div>
            <p className="text-xs font-medium tracking-wider text-[#9E7C3B]">
              Collector Provenance
            </p>
            <h2 className="font-serif text-3xl font-semibold text-[#1E1E1E] mt-1">
              Verified Customer Reviews
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous customer reviews"
              onClick={() =>
                setReviewIndex((prev) =>
                  prev === 0 ? maxReviewStart : prev - 1
                )
              }
              className="w-10 h-10 rounded-md border border-[#1E1E1E]/15 bg-white flex items-center justify-center text-[#1E1E1E] hover:bg-[#F1EBE0] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Next customer reviews"
              onClick={() =>
                setReviewIndex((prev) => (prev + 1) % Math.max(1, reviews.length))
              }
              className="w-10 h-10 rounded-md border border-[#1E1E1E]/15 bg-white flex items-center justify-center text-[#1E1E1E] hover:bg-[#F1EBE0] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentReviews.map((review) => (
            <article
              key={review.id}
              className="bg-white border border-[#1E1E1E]/10 rounded-lg p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-4 h-4 ${
                          starIdx < review.rating
                            ? 'fill-[#C5A059] text-[#C5A059]'
                            : 'text-[#1E1E1E]/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#1B3B2B] font-medium">
                    Verified Buyer
                  </span>
                </div>

                <p className="text-sm text-[#1E1E1E]/85 leading-relaxed">
                  “{review.comment}”
                </p>
              </div>

              <div className="pt-4 border-t border-[#1E1E1E]/8 text-xs">
                <p className="font-semibold text-[#1E1E1E]">{review.authorName}</p>
                <p className="text-[#1E1E1E]/60 mt-0.5">
                  {review.authorLocation} <span aria-hidden="true">·</span> {review.productName}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
