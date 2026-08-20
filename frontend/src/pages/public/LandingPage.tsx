import { useSettings, useSections } from '@/hooks/usePublicContent';
import { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useSeo } from '@/hooks/useSeo';
import { applyAppearance } from '@/hooks/useAppearance';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import { whatsappFromSettings } from '@/utils/whatsapp';
import type { PageSection, SiteSettings } from '@/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { BackToTopButton } from '@/components/common/BackToTopButton';
import { HeroSection } from '@/sections/HeroSection';
import { AboutSection } from '@/sections/AboutSection';
import { WorkshopSection } from '@/sections/WorkshopSection';
import { InstrumentsSection } from '@/sections/InstrumentsSection';
import { ArtistsSection } from '@/sections/ArtistsSection';
import { ContactSection } from '@/sections/ContactSection';
import { CustomSection } from '@/sections/CustomSection';

type SectionProps = { section: PageSection; settings?: SiteSettings };

// Mapa key → componente. El orden y la visibilidad vienen de la base de datos.
// Las secciones sin componente propio (creadas por el admin) usan CustomSection.
const SECTION_COMPONENTS: Record<string, ComponentType<SectionProps>> = {
  hero: HeroSection,
  about: AboutSection,
  workshop: WorkshopSection,
  instruments: InstrumentsSection,
  artists: ArtistsSection,
  contact: ContactSection,
};

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

  const ordered = [...(sections ?? [])]
    .filter((s) => s.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-charcoal-950">
      <Header settings={settings} activeSection={activeSection} />
      <main>
        {ordered.map((section) => {
          const Component = SECTION_COMPONENTS[section.key] ?? CustomSection;
          return <Component key={section.id} section={section} settings={settings} />;
        })}
      </main>
      <Footer settings={settings} />
      {settings && <WhatsAppButton url={waUrl} label="WhatsApp" variant="floating" />}
      <BackToTopButton />
    </div>
  );
}
