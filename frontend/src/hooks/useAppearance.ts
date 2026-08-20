import { getTheme, HEADING_FONTS, BODY_FONTS } from '@/config/appearance';

const loadedFonts = new Set<string>();

/** Carga una fuente de Google Fonts una sola vez. */
function loadGoogleFont(family: string): void {
  if (!family || loadedFonts.has(family)) return;
  loadedFonts.add(family);
  const id = `gf-${family.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  const q = family.trim().replace(/\s+/g, '+');
  link.href = `https://fonts.googleapis.com/css2?family=${q}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

interface AppearanceInput {
  fontHeading?: string | null;
  fontBody?: string | null;
  colorTheme?: string | null;
}

/** Aplica tipografías y tema de color a :root en base a la configuración. */
export function applyAppearance(input: AppearanceInput): void {
  const root = document.documentElement;

  const heading = input.fontHeading && HEADING_FONTS.includes(input.fontHeading)
    ? input.fontHeading
    : 'Cormorant Garamond';
  const body = input.fontBody && BODY_FONTS.includes(input.fontBody) ? input.fontBody : 'Inter';

  loadGoogleFont(heading);
  loadGoogleFont(body);
  root.style.setProperty('--font-display', `'${heading}'`);
  root.style.setProperty('--font-body', `'${body}'`);

  const theme = getTheme(input.colorTheme ?? 'cobre');
  root.style.setProperty('--accent-400', theme.accent[0]);
  root.style.setProperty('--accent-500', theme.accent[1]);
  root.style.setProperty('--accent-600', theme.accent[2]);
}
