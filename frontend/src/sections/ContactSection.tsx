import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Mail, Phone } from 'lucide-react';
import type { PageSection, SiteSettings } from '@/types';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import { SectionTitle } from '@/components/common/SectionTitle';
import { SocialLinks } from '@/components/common/SocialLinks';
import { ContactForm } from '@/components/forms/ContactForm';

interface ContactSectionProps {
  section?: PageSection;
  settings?: SiteSettings;
}

export function ContactSection({ section, settings }: ContactSectionProps) {
  const { t } = useTranslation();
  const { pick } = useLocalizedContent();

  return (
    <section id="contact" className="bg-cream-50 dark:bg-charcoal-900">
      <div className="section-pad">
        <SectionTitle
          eyebrow={section ? (pick(section, 'subtitle') as string) : undefined}
          title={section ? (pick(section, 'title') as string) : t('contact.title')}
        />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            {settings && (
              <ul className="space-y-4 text-wood-700 dark:text-cream-200/80">
                <InfoRow Icon={Mail} label={t('contact.info.email')}>
                  <a href={`mailto:${settings.email}`} className="hover:text-copper-500">
                    {settings.email}
                  </a>
                </InfoRow>
                <InfoRow Icon={Phone} label={t('contact.info.phone')}>
                  {settings.phone}
                </InfoRow>
                <InfoRow Icon={MapPin} label={t('contact.info.address')}>
                  {pick(settings, 'address') as string}
                </InfoRow>
                <InfoRow Icon={Clock} label={t('contact.info.hours')}>
                  {pick(settings, 'openingHours') as string}
                </InfoRow>
              </ul>
            )}
            {settings && <SocialLinks settings={settings} />}
            {settings?.mapEmbedUrl && (
              <iframe
                src={settings.mapEmbedUrl}
                title="MarzTone — Google Maps"
                loading="lazy"
                className="h-64 w-full rounded-xl border border-wood-500/15 dark:border-copper-400/15"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  Icon,
  label,
  children,
}: {
  Icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <Icon size={20} className="mt-0.5 text-copper-500" aria-hidden />
      <span>
        <span className="block text-xs font-semibold uppercase tracking-wide text-wood-500 dark:text-cream-200/50">
          {label}
        </span>
        {children}
      </span>
    </li>
  );
}
