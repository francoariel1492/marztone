import { motion } from 'framer-motion';
import type { PageSection, SiteSettings } from '@/types';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import { SectionTitle } from '@/components/common/SectionTitle';
import { SectionShell } from '@/components/common/SectionShell';

/**
 * Renderiza secciones creadas desde el panel (sin componente propio):
 * título, subtítulo, texto e imagen según el layout elegido.
 */
export function CustomSection({ section }: { section?: PageSection; settings?: SiteSettings }) {
  const { pick } = useLocalizedContent();
  if (!section) return null;

  const content = (pick(section, 'content') as string) ?? '';

  return (
    <SectionShell id={section.key} section={section}>
      {({ onDark, center, reverse, stacked, hideImage }) => {
        const showImage = Boolean(section.imageUrl) && !hideImage;

        const imageBlock = showImage ? (
          <motion.div
            initial={{ opacity: 0, x: reverse ? 24 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl shadow-soft"
          >
            <img
              src={section.imageUrl as string}
              alt={pick(section, 'title') as string}
              className={`w-full object-cover ${stacked ? 'aspect-video' : 'aspect-[4/5]'}`}
              loading="lazy"
            />
          </motion.div>
        ) : null;

        const textBlock = (
          <div>
            <SectionTitle
              eyebrow={(pick(section, 'subtitle') as string) || undefined}
              title={pick(section, 'title') as string}
              center={center}
              onDark={onDark}
            />
            {content && (
              <p
                className={`whitespace-pre-line text-lg leading-relaxed ${
                  center ? 'text-center' : ''
                } ${onDark ? 'text-cream-100/90' : 'text-wood-700 dark:text-cream-200/80'}`}
              >
                {content}
              </p>
            )}
          </div>
        );

        if (stacked) {
          return (
            <div className="mx-auto max-w-3xl space-y-8">
              {imageBlock}
              {textBlock}
            </div>
          );
        }

        if (!imageBlock) {
          return <div className={center ? 'mx-auto max-w-3xl' : ''}>{textBlock}</div>;
        }

        const cols = reverse ? [imageBlock, textBlock] : [textBlock, imageBlock];
        return (
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {cols.map((block, i) => (
              <div key={i}>{block}</div>
            ))}
          </div>
        );
      }}
    </SectionShell>
  );
}
