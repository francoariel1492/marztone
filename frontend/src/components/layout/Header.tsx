import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Wordmark } from '@/components/common/Wordmark';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { ThemeSelector } from '@/components/common/ThemeSelector';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { NAV_ITEMS, scrollToSection } from './navigation';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import { whatsappFromSettings } from '@/utils/whatsapp';
import type { SiteSettings } from '@/types';

interface HeaderProps {
  settings?: SiteSettings;
  activeSection: string;
}

export function Header({ settings, activeSection }: HeaderProps) {
  const { t } = useTranslation();
  const { isEn } = useLocalizedContent();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleNav = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  const waUrl = settings ? whatsappFromSettings(settings, isEn) : '#';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream-100/95 backdrop-blur-md shadow-soft dark:bg-charcoal-950/95'
          : 'bg-transparent'
      }`}
    >
      {/* Degradado sutil arriba para que el texto claro se lea sobre la foto del hero */}
      {!scrolled && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal-950/55 to-transparent"
          aria-hidden
        />
      )}
      <nav className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => handleNav('hero')} aria-label="MarzTone — Inicio">
          <Wordmark logoUrl={settings?.logoUrl} size="sm" onDark={!scrolled} />
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNav(item.id)}
                aria-current={activeSection === item.id ? 'true' : undefined}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? scrolled
                      ? 'text-copper-500'
                      : 'text-copper-300'
                    : scrolled
                      ? 'text-wood-700 hover:text-wood-900 dark:text-cream-200 dark:hover:text-cream-50'
                      : 'text-cream-100/90 hover:text-white'
                }`}
              >
                {t(item.labelKey)}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSelector onDark={!scrolled} />
          <ThemeSelector onDark={!scrolled} />
          <WhatsAppButton url={waUrl} label="WhatsApp" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t('common.close') : 'Menú'}
          className={`rounded-lg p-2 lg:hidden ${
            scrolled || open ? 'text-wood-800 dark:text-cream-100' : 'text-cream-50'
          }`}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-wood-500/15 bg-cream-100 px-4 pb-6 pt-2 dark:border-copper-400/15 dark:bg-charcoal-950 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNav(item.id)}
                  className={`w-full rounded-lg px-3 py-3 text-left text-base font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-wood-500/10 text-copper-500'
                      : 'text-wood-800 dark:text-cream-100'
                  }`}
                >
                  {t(item.labelKey)}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <LanguageSelector />
            <ThemeSelector />
          </div>
          <div className="mt-4">
            <WhatsAppButton url={waUrl} label="WhatsApp" />
          </div>
        </div>
      )}
    </header>
  );
}
