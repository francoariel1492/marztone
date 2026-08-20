import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Mail, Phone } from 'lucide-react';
import { Wordmark } from '@/components/common/Wordmark';
import { SocialLinks } from '@/components/common/SocialLinks';
import { NAV_ITEMS, scrollToSection } from './navigation';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import type { SiteSettings } from '@/types';

export function Footer({ settings }: { settings?: SiteSettings }) {
  const { t } = useTranslation();
  const { pick } = useLocalizedContent();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-wood-500/15 bg-cream-50 dark:border-copper-400/15 dark:bg-charcoal-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <Wordmark logoUrl={settings?.logoUrl} size="md" />
          <p className="mt-4 text-sm text-wood-600 dark:text-cream-200/70">
            {settings ? pick(settings, 'slogan') : ''}
          </p>
          {settings && <SocialLinks settings={settings} className="mt-5" />}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-copper-500">
            {t('footer.quickNav')}
          </h3>
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm text-wood-600 transition-colors hover:text-copper-500 dark:text-cream-200/70"
                >
                  {t(item.labelKey)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-copper-500">
            {t('contact.title')}
          </h3>
          {settings && (
            <ul className="space-y-3 text-sm text-wood-600 dark:text-cream-200/70">
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 text-copper-500" aria-hidden />
                <a href={`mailto:${settings.email}`} className="hover:text-copper-500">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 text-copper-500" aria-hidden />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-copper-500" aria-hidden />
                <span>{pick(settings, 'address')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={16} className="mt-0.5 text-copper-500" aria-hidden />
                <span>{pick(settings, 'openingHours')}</span>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-wood-500/15 dark:border-copper-400/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-wood-500 dark:text-cream-200/50 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} MarzTone. {t('footer.rights')}
          </p>
          <p className="italic">{t('common.handmade')}</p>
        </div>
      </div>
    </footer>
  );
}
