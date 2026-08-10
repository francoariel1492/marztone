interface WordmarkProps {
  logoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { name: 'text-xl', sign: 'text-[10px]' },
  md: { name: 'text-2xl', sign: 'text-xs' },
  lg: { name: 'text-6xl sm:text-7xl', sign: 'text-base sm:text-lg' },
};

/**
 * Wordmark tipográfico de MarzTone. Placeholder elegante hasta tener logo definitivo.
 * "MarzTone" es el elemento principal; "by Manuel Robles Urquiza" es la firma.
 */
export function Wordmark({ logoUrl, size = 'md', className = '' }: WordmarkProps) {
  const s = sizeMap[size];
  if (logoUrl) {
    return <img src={logoUrl} alt="MarzTone by Manuel Robles Urquiza" className={className} />;
  }
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span
        className={`font-display font-bold tracking-tight text-wood-900 dark:text-cream-100 ${s.name}`}
      >
        Marz<span className="text-copper-500 dark:text-copper-400">Tone</span>
      </span>
      <span
        className={`mt-0.5 font-display italic tracking-wide text-wood-500 dark:text-copper-400/80 ${s.sign}`}
      >
        by Manuel Robles Urquiza
      </span>
    </span>
  );
}
