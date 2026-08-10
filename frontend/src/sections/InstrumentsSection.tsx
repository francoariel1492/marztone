import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Instrument, SiteSettings } from '@/types';
import { useCategories, useInstruments } from '@/hooks/usePublicContent';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import { SectionTitle } from '@/components/common/SectionTitle';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/common/States';
import { InstrumentCard } from '@/components/cards/InstrumentCard';
import { InstrumentModal } from '@/components/cards/InstrumentModal';

export function InstrumentsSection({ settings }: { settings?: SiteSettings }) {
  const { t } = useTranslation();
  const { pick } = useLocalizedContent();
  const [category, setCategory] = useState<string>('all');
  const [selected, setSelected] = useState<Instrument | null>(null);

  const { data: categories } = useCategories();
  const { data, isLoading, isError } = useInstruments(category);

  return (
    <section id="instruments" className="section-pad">
      <SectionTitle title={t('instruments.title')} />

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <FilterButton active={category === 'all'} onClick={() => setCategory('all')}>
          {t('common.all')}
        </FilterButton>
        {categories?.map((cat) => (
          <FilterButton
            key={cat.id}
            active={category === cat.slug}
            onClick={() => setCategory(cat.slug)}
          >
            {pick(cat, 'name') as string}
          </FilterButton>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorState />
      ) : data && data.data.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((instrument) => (
            <InstrumentCard key={instrument.id} instrument={instrument} onOpen={setSelected} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {selected && (
        <InstrumentModal
          instrument={selected}
          settings={settings}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-wood-800 text-cream-100 dark:bg-copper-500 dark:text-charcoal-950'
          : 'border border-wood-500/25 text-wood-700 hover:bg-wood-500/10 dark:border-copper-400/25 dark:text-cream-200'
      }`}
    >
      {children}
    </button>
  );
}
