import { useTranslation } from 'react-i18next';
import type { PageSection } from '@/types';
import { useWorkshop } from '@/hooks/usePublicContent';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import { SectionTitle } from '@/components/common/SectionTitle';
import { SectionShell } from '@/components/common/SectionShell';
import { ImageGallery } from '@/components/common/ImageGallery';
import { EmptyState, LoadingSpinner } from '@/components/common/States';

const PROCESS_STEPS_ES = [
  'Diseño y asesoramiento',
  'Selección de materiales',
  'Construcción',
  'Electrónica y componentes',
  'Terminaciones',
  'Ajuste y pruebas finales',
  'Entrega',
];
const PROCESS_STEPS_EN = [
  'Design & consulting',
  'Material selection',
  'Building',
  'Electronics & components',
  'Finishes',
  'Setup & final testing',
  'Delivery',
];

export function WorkshopSection({ section }: { section?: PageSection }) {
  const { data, isLoading } = useWorkshop();
  const { pick, isEn } = useLocalizedContent();
  const { t } = useTranslation();
  const steps = isEn ? PROCESS_STEPS_EN : PROCESS_STEPS_ES;

  const images = (data ?? []).map((img) => ({
    src: img.imageUrl,
    alt: pick(img, 'alt') as string,
  }));

  return (
    <SectionShell id="workshop" section={section} defaultBg="bg-cream-50 dark:bg-charcoal-900">
      {({ onDark, center }) => (
        <>
          <SectionTitle
            eyebrow={section ? (pick(section, 'subtitle') as string) : undefined}
            title={section ? (pick(section, 'title') as string) : t('nav.workshop')}
            center={center}
            onDark={onDark}
          />

          <ol className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-3 rounded-xl border border-wood-500/15 bg-cream-100 p-4 dark:border-copper-400/15 dark:bg-charcoal-800"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-wood-800 text-sm font-semibold text-cream-100 dark:bg-copper-500 dark:text-charcoal-950">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-wood-800 dark:text-cream-100">{step}</span>
              </li>
            ))}
          </ol>

          {isLoading ? (
            <LoadingSpinner />
          ) : images.length ? (
            <ImageGallery images={images} />
          ) : (
            <EmptyState />
          )}
        </>
      )}
    </SectionShell>
  );
}
