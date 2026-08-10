import { useTranslation } from 'react-i18next';
import { useTestimonials } from '@/hooks/usePublicContent';
import { SectionTitle } from '@/components/common/SectionTitle';
import { EmptyState, ErrorState, LoadingSpinner } from '@/components/common/States';
import { TestimonialCard } from '@/components/cards/TestimonialCard';

export function TestimonialsSection() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useTestimonials();

  return (
    <section id="testimonials" className="section-pad">
      <SectionTitle title={t('testimonials.title')} />
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorState />
      ) : data && data.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
