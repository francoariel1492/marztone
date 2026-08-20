import type { SectionLayout } from '@/types';

/** Barra que simula una línea de texto. */
function Line({ w = 'w-full', dark = false }: { w?: string; dark?: boolean }) {
  return <span className={`block h-1 rounded-full ${dark ? 'bg-cream-100/80' : 'bg-wood-400/70'} ${w}`} />;
}

/** Bloque que simula una imagen. */
function Img({ className = '' }: { className?: string }) {
  return <span className={`block rounded bg-copper-400/50 ${className}`} />;
}

/**
 * Miniatura esquemática de un layout, para que el admin visualice
 * cómo se dispondrá el contenido en la web.
 */
export function LayoutPreview({ layout }: { layout: SectionLayout }) {
  const base = 'flex h-16 w-full overflow-hidden rounded-md border border-wood-500/20 bg-cream-50 p-2 dark:bg-charcoal-800';

  switch (layout) {
    case 'imagen-derecha':
      return (
        <div className={`${base} items-center gap-2`}>
          <div className="flex flex-1 flex-col gap-1">
            <Line w="w-3/4" />
            <Line />
            <Line w="w-2/3" />
          </div>
          <Img className="h-full w-1/3" />
        </div>
      );
    case 'imagen-izquierda':
      return (
        <div className={`${base} items-center gap-2`}>
          <Img className="h-full w-1/3" />
          <div className="flex flex-1 flex-col gap-1">
            <Line w="w-3/4" />
            <Line />
            <Line w="w-2/3" />
          </div>
        </div>
      );
    case 'texto-centrado':
      return (
        <div className={`${base} flex-col items-center justify-center gap-1`}>
          <Line w="w-1/2" />
          <Line w="w-3/4" />
          <Line w="w-1/3" />
        </div>
      );
    case 'imagen-fondo':
      return (
        <div className={`${base} relative items-center justify-center p-0`}>
          <Img className="absolute inset-0 h-full w-full rounded-md opacity-80" />
          <div className="relative flex flex-col items-center gap-1">
            <Line w="w-16" dark />
            <Line w="w-10" dark />
          </div>
        </div>
      );
    case 'apilado':
      return (
        <div className={`${base} flex-col items-center gap-1.5`}>
          <Img className="h-6 w-2/3" />
          <Line w="w-1/2" />
          <Line w="w-2/3" />
        </div>
      );
    case 'banda-color':
      return (
        <div className="flex h-16 w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-md bg-gradient-to-br from-wood-800 to-charcoal-900 p-2">
          <Line w="w-1/2" dark />
          <Line w="w-3/4" dark />
          <Line w="w-1/3" dark />
        </div>
      );
    default:
      return null;
  }
}
