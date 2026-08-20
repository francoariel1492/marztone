import type { SectionLayout } from '@/types';

export const SECTION_LAYOUT_OPTIONS: { value: SectionLayout; label: string }[] = [
  { value: 'imagen-derecha', label: 'Texto izquierda · Imagen derecha' },
  { value: 'imagen-izquierda', label: 'Imagen izquierda · Texto derecha' },
  { value: 'texto-centrado', label: 'Texto centrado' },
  { value: 'imagen-fondo', label: 'Imagen de fondo (overlay)' },
  { value: 'apilado', label: 'Apilado (imagen arriba)' },
  { value: 'banda-color', label: 'Banda de color' },
];

export interface SectionLayoutStyle {
  /** Alinear el encabezado al centro. */
  center: boolean;
  /** Invertir el orden imagen/texto (imagen a la izquierda). */
  reverse: boolean;
  /** Usar la imagen como fondo a pantalla completa con overlay. */
  backgroundImage: boolean;
  /** Mostrar la imagen apilada arriba del texto. */
  stacked: boolean;
  /** Ocultar la imagen lateral (texto centrado / banda). */
  hideImage: boolean;
  /** Clases de fondo para la sección. */
  bg: string;
}

const BANDA_BG =
  'bg-gradient-to-br from-wood-800 to-charcoal-900 text-cream-100 dark:from-charcoal-900 dark:to-charcoal-950';

export function getLayoutStyle(layout: SectionLayout): SectionLayoutStyle {
  switch (layout) {
    case 'imagen-izquierda':
      return { center: false, reverse: true, backgroundImage: false, stacked: false, hideImage: false, bg: '' };
    case 'texto-centrado':
      return { center: true, reverse: false, backgroundImage: false, stacked: false, hideImage: true, bg: '' };
    case 'imagen-fondo':
      return { center: true, reverse: false, backgroundImage: true, stacked: false, hideImage: false, bg: '' };
    case 'apilado':
      return { center: true, reverse: false, backgroundImage: false, stacked: true, hideImage: false, bg: '' };
    case 'banda-color':
      return { center: true, reverse: false, backgroundImage: false, stacked: false, hideImage: true, bg: BANDA_BG };
    case 'imagen-derecha':
    default:
      return { center: false, reverse: false, backgroundImage: false, stacked: false, hideImage: false, bg: '' };
  }
}
