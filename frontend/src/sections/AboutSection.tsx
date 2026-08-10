import { motion } from 'framer-motion';
import type { PageSection } from '@/types';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import { SectionTitle } from '@/components/common/SectionTitle';

export function AboutSection({ section }: { section?: PageSection }) {
  const { pick } = useLocalizedContent();
  if (!section) return null;

  return (
    <section id="about" className="section-pad">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {section.imageUrl && (
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl shadow-soft"
          >
            <img
              src={section.imageUrl}
              alt={pick(section, 'subtitle') as string}
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        )}
        <div>
          <SectionTitle
            eyebrow={pick(section, 'subtitle') as string}
            title={pick(section, 'title') as string}
            center={false}
          />
          <p className="whitespace-pre-line text-lg leading-relaxed text-wood-700 dark:text-cream-200/80">
            {pick(section, 'content') as string}
          </p>
        </div>
      </div>
    </section>
  );
}
