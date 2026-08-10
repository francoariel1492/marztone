export interface NavItem {
  id: string;
  labelKey: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'hero', labelKey: 'nav.home' },
  { id: 'about', labelKey: 'nav.about' },
  { id: 'workshop', labelKey: 'nav.workshop' },
  { id: 'instruments', labelKey: 'nav.instruments' },
  { id: 'artists', labelKey: 'nav.artists' },
  { id: 'services', labelKey: 'nav.services' },
  { id: 'testimonials', labelKey: 'nav.testimonials' },
  { id: 'contact', labelKey: 'nav.contact' },
];

export const HEADER_OFFSET = 80;

export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: 'smooth' });
}
