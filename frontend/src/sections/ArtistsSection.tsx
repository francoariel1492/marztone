import { useTranslation } from 'react-i18next';
import type { PageSection } from '@/types';
import { useArtists } from '@/hooks/usePublicContent';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import { SectionTitle } from '@/components/common/SectionTitle';
import { SectionShell } from '@/components/common/SectionShell';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/common/States';
import { ArtistCard } from '@/components/cards/ArtistCard';

export function ArtistsSection({ section }: { section?: PageSection }) {
  const { t } = useTranslation();
  const { pick } = useLocalizedContent();
  const { data, isLoading, isError } = useArtists();

  return (
    <SectionShell id="artists" section={section} defaultBg="bg-cream-50 dark:bg-charcoal-900">
      {({ onDark, center }) => (
        <>
          <SectionTitle
            eyebrow={section ? (pick(section, 'subtitle') as string) : undefined}
            title={section ? (pick(section, 'title') as string) : t('artists.title')}
            center={center}
            onDark={onDark}
          />
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <ErrorState />
          ) : data && data.data.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </>
      )}
    </SectionShell>
  );
}
