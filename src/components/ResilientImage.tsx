import { useState } from 'react';
import { Gem } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackLabel,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F1EBE0] via-[#FAF7F2] to-[#E8DFCF] text-[#1B3B2B] p-6 text-center ${className}`}
      >
        <Gem className="w-7 h-7 text-[#C5A059] mb-2" strokeWidth={1.5} />
        <span className="font-serif text-sm text-[#1E1E1E]/80 max-w-[16rem] leading-snug">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
