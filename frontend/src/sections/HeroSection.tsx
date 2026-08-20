import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PageSection, SiteSettings } from '@/types';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import { whatsappFromSettings } from '@/utils/whatsapp';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { scrollToSection } from '@/components/layout/navigation';

interface HeroSectionProps {
  section?: PageSection;
  settings?: SiteSettings;
}

export function HeroSection({ section, settings }: HeroSectionProps) {
  const { t } = useTranslation();
  const { pick, isEn } = useLocalizedContent();

  const slogan = section ? (pick(section, 'subtitle') as string) : '';
  const description = section ? (pick(section, 'content') as string) : '';
  const image = section?.imageUrl ?? undefined;
  const waUrl = settings ? whatsappFromSettings(settings, isEn) : '#';

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="MarzTone" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/60 to-charcoal-950/40" />
        </div>
      )}
      <div className="absolute inset-0 bg-grain opacity-40" aria-hidden />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <h1 className="sr-only">MarzTone by Manuel Robles Urquiza</h1>
          <img
            src="/logo-dark.png"
            alt="MarzTone"
            className="h-24 w-auto sm:h-40"
            loading="eager"
          />
          <p className="mt-3 font-display text-lg italic text-copper-300 sm:text-xl">
            by Manuel Robles Urquiza
          </p>
          <p className="mt-6 text-xl font-medium text-cream-100 sm:text-2xl">{slogan}</p>
          <p className="mt-4 max-w-xl text-cream-100/80">{description}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => scrollToSection('instruments')}
              className="btn bg-copper-500 text-charcoal-950 shadow-warm transition-colors hover:bg-copper-400"
            >
              {t('hero.ctaInstruments')}
            </button>
            <WhatsAppButton url={waUrl} label={t('hero.ctaWhatsapp')} />
          </div>
        </motion.div>
      </div>

      <button
        onClick={() => scrollToSection('about')}
        aria-label={t('hero.scroll')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream-100/80"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="block"
        >
          <ChevronDown size={30} />
        </motion.span>
      </button>
    </section>
  );
}
