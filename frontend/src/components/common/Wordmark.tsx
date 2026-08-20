import { useTheme } from '@/store/theme';

interface WordmarkProps {
  logoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onDark?: boolean;
}

const sizeMap = {
  sm: { img: 'h-8', sign: 'text-[10px]' },
  md: { img: 'h-11', sign: 'text-xs' },
  lg: { img: 'h-20', sign: 'text-base sm:text-lg' },
};

/**
 * Logo de MarzTone: versión dorada sobre fondos oscuros (dark mode / hero) y negra
 * sobre fondos claros. La firma "by Manuel Robles Urquiza" acompaña como subtítulo.
 */
export function Wordmark({ logoUrl, size = 'md', className = '', onDark = false }: WordmarkProps) {
  const { isDark } = useTheme();
  const s = sizeMap[size];
  const onDarkBg = onDark || isDark;
  const signColor = onDarkBg ? 'text-cream-100/75' : 'text-wood-500';

  // Logo cargado desde el panel (override) tiene prioridad.
  if (logoUrl) {
    return <img src={logoUrl} alt="MarzTone by Manuel Robles Urquiza" className={className} />;
  }

  const logoSrc = onDarkBg ? '/logo-dark.png' : '/logo-light.png';
  return (
    <span className={`flex flex-col items-start leading-none ${className}`}>
      <img
        src={logoSrc}
        alt="MarzTone by Manuel Robles Urquiza"
        className={`${s.img} w-auto`}
        loading="eager"
      />
      <span className={`mt-1 font-display italic tracking-wide ${signColor} ${s.sign}`}>
        by Manuel Robles Urquiza
      </span>
    </span>
  );
}
