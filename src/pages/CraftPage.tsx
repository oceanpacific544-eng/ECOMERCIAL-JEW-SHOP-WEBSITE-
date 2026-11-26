import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ResilientImage } from '../components/ResilientImage';
import { CRAFT_FILMS, CRAFT_GALLERY } from '../data/seedData';
import { useStore } from '../store/useStore';
import type { CraftFilm, CraftGalleryItem } from '../types/jewelry';

export function CraftPage() {
  const { navigate } = useStore();
  const [activePhoto, setActivePhoto] = useState<CraftGalleryItem | null>(null);
  const [activeFilm, setActiveFilm] = useState<CraftFilm | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Interactive film reel playback loop
  useEffect(() => {
    if (!activeFilm || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setChapterIndex((c) => (c + 1) % activeFilm.chapters.length);
          return 0;
        }
        return prev + 2;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [activeFilm, isPlaying]);

  const openFilm = (film: CraftFilm) => {
    setActiveFilm(film);
    setChapterIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header */}
      <section className="border-b border-[#1E1E1E]/10 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-medium tracking-wider text-[#9E7C3B]">
            Jaipur · Mumbai · Bikaner Workshops
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#1E1E1E] leading-tight [text-wrap:balance]">
            Craftsmanship &amp; Atelier Galleries
          </h1>
          <p className="text-sm sm:text-base text-[#1E1E1E]/75 leading-relaxed">
            Every piece begins at a weathered teak bench—shaped by hand-forged steel stakes, pure 24k kundan foil, and vitreous emerald enamels without industrial casting.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="self-start lg:self-auto px-5 py-2.5 text-sm font-medium bg-[#1B3B2B] text-[#FAF7F2] rounded-md hover:bg-[#142D20] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Shop Finished Heirlooms
        </button>
      </section>

      {/* 1. High-Density Masonry Photo Gallery */}
      <section className="space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E1E1E]">
              Macro Bench Study
            </h2>
            <p className="text-sm text-[#1E1E1E]/65 mt-1">
              Click any frame to inspect artisan technique, tool marks, and provenance notes.
            </p>
          </div>
          <span className="text-xs text-[#1E1E1E]/55 tabular-nums hidden sm:inline">
            {CRAFT_GALLERY.length} archival studies
          </span>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {CRAFT_GALLERY.map((item) => {
            const aspectClass =
              item.aspect === 'tall'
                ? 'aspect-[3/4]'
                : item.aspect === 'wide'
                  ? 'aspect-[4/3]'
                  : 'aspect-square';

            return (
              <figure
                key={item.id}
                className="break-inside-avoid bg-white border border-[#1E1E1E]/10 rounded-lg overflow-hidden group"
              >
                <button
                  type="button"
                  onClick={() => setActivePhoto(item)}
                  className={`w-full ${aspectClass} overflow-hidden bg-[#F1EBE0] block cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1B3B2B]`}
                >
                  <ResilientImage
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
                <figcaption className="p-5 space-y-2">
                  <p className="text-xs text-[#9E7C3B] font-medium">
                    {item.technique} <span aria-hidden="true">·</span> {item.workshop}
                  </p>
                  <h3 className="font-serif text-lg font-semibold text-[#1E1E1E]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#1E1E1E]/70 leading-relaxed">
                    {item.caption}
                  </p>
                  <p className="text-xs text-[#1E1E1E]/55 pt-1">
                    Master Karigar: {item.artisan}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* 2. Interactive Behind-the-Scenes Video Showcase */}
      <section className="space-y-8 pt-4 border-t border-[#1E1E1E]/10">
        <div>
          <p className="text-xs font-medium tracking-wider text-[#9E7C3B]">
            Behind the Bench
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E1E1E] mt-1">
            Atelier Documentary Reels
          </h2>
          <p className="text-sm text-[#1E1E1E]/70 mt-1 max-w-2xl">
            Step inside our Jaipur and Mumbai workshops with interactive chaptered studies of traditional gold planishing, Kundan setting, and Meenakari firing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {CRAFT_FILMS.map((film) => (
            <article
              key={film.id}
              className="bg-white border border-[#1E1E1E]/10 rounded-lg overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <button
                  type="button"
                  onClick={() => openFilm(film)}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-[#1B3B2B] block cursor-pointer"
                >
                  <ResilientImage
                    src={film.thumbnailUrl}
                    alt={film.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[#1E1E1E]/35 group-hover:bg-[#1E1E1E]/25 transition-colors flex items-center justify-center"
                  >
                    <span className="w-14 h-14 rounded-full bg-[#FAF7F2]/95 text-[#1B3B2B] flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110">
                      <Play className="w-5 h-5 fill-[#1B3B2B] ml-0.5" />
                    </span>
                  </div>
                  <span className="absolute bottom-3 right-3 px-2 py-1 text-xs font-medium bg-[#1E1E1E]/80 text-[#FAF7F2] rounded tabular-nums">
                    {film.duration}
                  </span>
                </button>

                <div className="p-5 space-y-2">
                  <p className="text-xs text-[#9E7C3B] font-medium">
                    {film.artisan} <span aria-hidden="true">·</span> {film.location}
                  </p>
                  <h3 className="font-serif text-lg font-semibold text-[#1E1E1E]">
                    {film.title}
                  </h3>
                  <p className="text-xs text-[#1E1E1E]/70 leading-relaxed">
                    {film.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5">
                <button
                  type="button"
                  onClick={() => openFilm(film)}
                  className="w-full py-2.5 px-4 text-xs font-semibold bg-[#1B3B2B] text-[#FAF7F2] rounded-md hover:bg-[#142D20] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Play Atelier Reel</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Lightbox Modal for Gallery Photo */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1E1E1E]/80 backdrop-blur-sm"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="bg-[#FAF7F2] rounded-xl max-w-4xl w-full overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:col-span-7 bg-[#1E1E1E] aspect-[4/3] md:aspect-auto">
              <ResilientImage
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-[#9E7C3B]">
                    {activePhoto.technique}
                  </p>
                  <button
                    type="button"
                    aria-label="Close gallery study"
                    onClick={() => setActivePhoto(null)}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-[#1E1E1E]/70 hover:bg-[#F1EBE0] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[#1E1E1E]">
                  {activePhoto.title}
                </h3>
                <p className="text-sm text-[#1E1E1E]/80 leading-relaxed">
                  {activePhoto.caption}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1E1E1E]/10 text-xs text-[#1E1E1E]/65 space-y-1">
                <p>
                  <span className="font-semibold text-[#1E1E1E]">Artisan:</span>{' '}
                  {activePhoto.artisan}
                </p>
                <p>
                  <span className="font-semibold text-[#1E1E1E]">Workshop:</span>{' '}
                  {activePhoto.workshop}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Video Player Modal */}
      {activeFilm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeFilm.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#121212]/85 backdrop-blur-sm"
          onClick={() => setActiveFilm(null)}
        >
          <div
            className="bg-[#1B3B2B] text-[#FAF7F2] rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#FAF7F2]/15"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="px-6 py-4 border-b border-[#FAF7F2]/15 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#C5A059] font-medium">
                  {activeFilm.artisan} <span aria-hidden="true">·</span> {activeFilm.location}
                </p>
                <h3 className="font-serif text-lg sm:text-xl font-semibold">
                  {activeFilm.title}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close atelier film"
                onClick={() => setActiveFilm(null)}
                className="w-9 h-9 rounded-md flex items-center justify-center text-[#FAF7F2]/80 hover:bg-[#FAF7F2]/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Film Viewport with Animated Ken Burns Motion */}
            <div className="relative aspect-[16/9] bg-black overflow-hidden">
              <ResilientImage
                src={activeFilm.chapters[chapterIndex].imageUrl}
                alt={activeFilm.chapters[chapterIndex].heading}
                className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                  isPlaying ? 'scale-110' : 'scale-100'
                }`}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
              />

              {/* Subtitles / Chapter Narrative Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 space-y-2">
                <p className="text-xs text-[#C5A059] font-medium tabular-nums">
                  Chapter 0{chapterIndex + 1} · {activeFilm.chapters[chapterIndex].timeLabel}
                </p>
                <h4 className="font-serif text-xl sm:text-2xl font-semibold text-white">
                  {activeFilm.chapters[chapterIndex].heading}
                </h4>
                <p className="text-xs sm:text-sm text-white/85 max-w-2xl leading-relaxed">
                  {activeFilm.chapters[chapterIndex].detail}
                </p>
              </div>
            </div>

            {/* Playback Controls & Chapter Scrubber */}
            <div className="px-6 py-4 bg-[#142D20] space-y-4">
              {/* Scrubber Bar */}
              <div className="w-full h-1.5 bg-[#FAF7F2]/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C5A059] transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#C5A059] text-[#1E1E1E] rounded-md hover:bg-[#d3b16d] transition-colors cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Play</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    aria-label="Previous chapter"
                    onClick={() => {
                      setChapterIndex(
                        (c) =>
                          (c - 1 + activeFilm.chapters.length) %
                          activeFilm.chapters.length
                      );
                      setProgress(0);
                    }}
                    className="w-9 h-9 rounded-md border border-[#FAF7F2]/25 flex items-center justify-center hover:bg-[#FAF7F2]/10 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next chapter"
                    onClick={() => {
                      setChapterIndex(
                        (c) => (c + 1) % activeFilm.chapters.length
                      );
                      setProgress(0);
                    }}
                    className="w-9 h-9 rounded-md border border-[#FAF7F2]/25 flex items-center justify-center hover:bg-[#FAF7F2]/10 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {activeFilm.chapters.map((ch, idx) => (
                    <button
                      key={ch.heading}
                      type="button"
                      onClick={() => {
                        setChapterIndex(idx);
                        setProgress(0);
                      }}
                      className={`px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                        idx === chapterIndex
                          ? 'bg-[#FAF7F2] text-[#1B3B2B] font-semibold'
                          : 'bg-[#FAF7F2]/10 text-[#FAF7F2]/80 hover:bg-[#FAF7F2]/20'
                      }`}
                    >
                      0{idx + 1}. {ch.heading}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
