import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import type { Testimonial } from '@/types';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { pick } = useLocalizedContent();

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
      className="card flex h-full flex-col p-6"
    >
      <Quote size={28} className="text-copper-500/50" aria-hidden />
      <blockquote className="mt-3 flex-1 text-wood-700 dark:text-cream-200/80">
        “{pick(testimonial, 'comment') as string}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {testimonial.customerImageUrl && (
          <img
            src={testimonial.customerImageUrl}
            alt={testimonial.customerName}
            loading="lazy"
            className="h-11 w-11 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-wood-900 dark:text-cream-100">
            {testimonial.customerName}
          </p>
          {(pick(testimonial, 'relatedWork') as string) && (
            <p className="text-xs text-copper-500">{pick(testimonial, 'relatedWork') as string}</p>
          )}
        </div>
      </figcaption>
    </motion.figure>
  );
}
