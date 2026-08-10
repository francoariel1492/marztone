import { useTranslation } from 'react-i18next';
import type { SiteSettings } from '@/types';
import { useServices } from '@/hooks/usePublicContent';
import { SectionTitle } from '@/components/common/SectionTitle';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/common/States';
import { ServiceCard } from '@/components/cards/ServiceCard';

export function ServicesSection({ settings }: { settings?: SiteSettings }) {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useServices();

  return (
    <section id="services" className="section-pad">
      <SectionTitle title={t('services.title')} />
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorState />
      ) : data && data.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((service, i) => (
            <ServiceCard key={service.id} service={service} settings={settings} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
