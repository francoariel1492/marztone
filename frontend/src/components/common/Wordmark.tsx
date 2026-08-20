import { useTheme } from '@/store/theme';

interface WordmarkProps {
  logoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onDark?: boolean;
  hideSignature?: boolean;
}

const sizeMap = {
  sm: { img: 'h-10' },
  md: { img: 'h-[4.5rem]' },
  lg: { img: 'h-[4.5rem]' },
};

/**
 * Logo de MarzTone: versión dorada sobre fondos oscuros (dark mode / hero) y negra
 * sobre fondos claros.
 */
export function Wordmark({
  logoUrl,
  size = 'md',
  className = '',
  onDark = false,
}: WordmarkProps) {
  const { isDark } = useTheme();
  const s = sizeMap[size];
  const onDarkBg = onDark || isDark;

  // Logo cargado desde el panel (override) tiene prioridad.
  if (logoUrl) {
    return <img src={logoUrl} alt="MarzTone" className={className} />;
  }

  const logoSrc = onDarkBg ? '/logo-dark.png' : '/logo-light.png';
  return (
    <span className={`flex flex-col items-start leading-none ${className}`}>
      <img
        src={logoSrc}
        alt="MarzTone"
        className={`${s.img} w-auto`}
        loading="eager"
      />
    </span>
  );
}
