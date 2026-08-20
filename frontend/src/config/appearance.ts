export interface ColorTheme {
  key: string;
  label: string;
  // RGB "R G B" para el acento (400/500/600)
  accent: [string, string, string];
  swatch: string; // color de muestra (hex) para el selector
}

export const COLOR_THEMES: ColorTheme[] = [
  { key: 'cobre', label: 'Cobre', accent: ['217 154 91', '193 127 63', '168 103 42'], swatch: '#c17f3f' },
  { key: 'dorado', label: 'Dorado', accent: ['212 176 106', '193 154 78', '168 132 47'], swatch: '#c19a4e' },
  { key: 'terracota', label: 'Terracota', accent: ['217 138 107', '196 106 69', '168 80 42'], swatch: '#c46a45' },
  { key: 'salvia', label: 'Salvia', accent: ['157 176 138', '125 148 102', '95 117 73'], swatch: '#7d9466' },
  { key: 'acero', label: 'Acero', accent: ['127 155 179', '95 125 153', '70 100 127'], swatch: '#5f7d99' },
  { key: 'vino', label: 'Vino', accent: ['181 107 116', '150 80 90', '122 61 70'], swatch: '#96505a' },
];

export const HEADING_FONTS = [
  'Cormorant Garamond',
  'Playfair Display',
  'Marcellus',
  'Fraunces',
  'DM Serif Display',
  'Libre Baskerville',
];

export const BODY_FONTS = ['Inter', 'Work Sans', 'Nunito Sans', 'Manrope', 'Karla', 'Mulish'];

export function getTheme(key: string): ColorTheme {
  return COLOR_THEMES.find((t) => t.key === key) ?? COLOR_THEMES[0];
}
