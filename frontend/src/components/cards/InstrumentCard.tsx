import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Instrument } from '@/types';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';

interface InstrumentCardProps {
  instrument: Instrument;
  onOpen: (instrument: Instrument) => void;
}

const statusStyles: Record<Instrument['status'], string> = {
  AVAILABLE: 'bg-green-600/15 text-green-700 dark:text-green-400',
  SOLD: 'bg-red-600/15 text-red-700 dark:text-red-400',
  MADE_TO_ORDER: 'bg-copper-500/15 text-copper-600 dark:text-copper-400',
};

export function InstrumentCard({ instrument, onOpen }: InstrumentCardProps) {
  const { t } = useTranslation();
  const { pick } = useLocalizedContent();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
      className="card group overflow-hidden"
    >
      <button
        onClick={() => onOpen(instrument)}
        className="block w-full text-left"
        aria-label={pick(instrument, 'name') as string}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={instrument.mainImageUrl}
            alt={pick(instrument, 'name') as string}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[instrument.status]}`}
          >
            {t(`instruments.status.${instrument.status}`)}
          </span>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-copper-500">
            {pick(instrument.category, 'name') as string}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-wood-900 dark:text-cream-100">
            {pick(instrument, 'name') as string}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-wood-600 dark:text-cream-200/70">
            {pick(instrument, 'description') as string}
          </p>
          {instrument.price && (
            <p className="mt-3 font-display text-lg font-semibold text-wood-800 dark:text-copper-400">
              {instrument.price} {instrument.currency}
            </p>
          )}
        </div>
      </button>
    </motion.article>
  );
}
