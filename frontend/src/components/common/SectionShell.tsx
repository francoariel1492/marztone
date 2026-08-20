import type { ReactNode } from 'react';
import type { PageSection } from '@/types';
import { getLayoutStyle } from '@/utils/sectionLayout';

interface SectionShellProps {
  id: string;
  section?: PageSection;
  /** Fondo por defecto cuando el layout no impone uno propio. */
  defaultBg?: string;
  children: (opts: { onDark: boolean; center: boolean; reverse: boolean; stacked: boolean; hideImage: boolean }) => ReactNode;
}

/**
 * Envoltorio de sección que aplica el layout elegido en el panel:
 * banda de color, imagen de fondo con overlay o fondo por defecto,
 * y expone flags de presentación a los hijos.
 */
export function SectionShell({ id, section, defaultBg = '', children }: SectionShellProps) {
  const style = getLayoutStyle(section?.layout ?? 'imagen-derecha');
  const useBgImage = style.backgroundImage && Boolean(section?.imageUrl);
  const onDark = Boolean(style.bg) || useBgImage;
  const wrapperBg = style.bg || (useBgImage ? '' : defaultBg);

  return (
    <section id={id} className={`relative overflow-hidden ${wrapperBg}`}>
      {useBgImage && section?.imageUrl && (
        <>
          <img
            src={section.imageUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-charcoal-950/70" />
        </>
      )}
      <div className="relative section-pad">
        {children({
          onDark,
          center: style.center,
          reverse: style.reverse,
          stacked: style.stacked,
          hideImage: style.hideImage,
        })}
      </div>
    </section>
  );
}
