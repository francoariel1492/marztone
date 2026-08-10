import { useTranslation } from 'react-i18next';
import { useArtists } from '@/hooks/usePublicContent';
import { SectionTitle } from '@/components/common/SectionTitle';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/common/States';
import { ArtistCard } from '@/components/cards/ArtistCard';

export function ArtistsSection() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useArtists();

  return (
    <section id="artists" className="bg-cream-50 dark:bg-charcoal-900">
      <div className="section-pad">
        <SectionTitle title={t('artists.title')} />
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
      </div>
    </section>
  );
}
