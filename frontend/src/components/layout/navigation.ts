export interface NavItem {
  id: string;
  labelKey: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'workshop', labelKey: 'nav.workshop' },
  { id: 'instruments', labelKey: 'nav.instruments' },
  { id: 'artists', labelKey: 'nav.artists' },
  { id: 'contact', labelKey: 'nav.contact' },
];

export const HEADER_OFFSET = 96;

export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: 'smooth' });
}
