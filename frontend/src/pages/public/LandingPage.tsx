import { useSettings, useSections } from '@/hooks/usePublicContent';
import { useEffect } from 'react';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useSeo } from '@/hooks/useSeo';
import { applyAppearance } from '@/hooks/useAppearance';
import { findSection } from '@/utils/sections';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import { whatsappFromSettings } from '@/utils/whatsapp';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { BackToTopButton } from '@/components/common/BackToTopButton';
import { HeroSection } from '@/sections/HeroSection';
import { WorkshopSection } from '@/sections/WorkshopSection';
import { InstrumentsSection } from '@/sections/InstrumentsSection';
import { ArtistsSection } from '@/sections/ArtistsSection';
import { ContactSection } from '@/sections/ContactSection';

export function LandingPage() {
  const { data: settings } = useSettings();
  const { data: sections } = useSections();
  const activeSection = useActiveSection();
  const { isEn } = useLocalizedContent();
  useSeo(settings);

  useEffect(() => {
    if (settings) {
      applyAppearance(settings);
    }
  }, [settings]);

  const waUrl = settings ? whatsappFromSettings(settings, isEn) : '#';

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-charcoal-950">
      <Header settings={settings} activeSection={activeSection} />
      <main>
        <HeroSection section={findSection(sections, 'hero')} settings={settings} />
        <WorkshopSection section={findSection(sections, 'workshop')} />
        <InstrumentsSection settings={settings} />
        <ArtistsSection />
        <ContactSection section={findSection(sections, 'contact')} settings={settings} />
      </main>
      <Footer settings={settings} />
      {settings && <WhatsAppButton url={waUrl} label="WhatsApp" variant="floating" />}
      <BackToTopButton />
    </div>
  );
}
