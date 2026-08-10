import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SectionTitle } from '@/components/common/SectionTitle';

const STEP_KEYS = ['1', '2', '3', '4', '5', '6', '7'];

export function ProcessSection() {
  const { t } = useTranslation();

  return (
    <section id="process" className="bg-cream-50 dark:bg-charcoal-900">
      <div className="section-pad">
        <SectionTitle title={t('process.title')} />
        <div className="relative">
          <div
            className="absolute left-4 top-0 hidden h-full w-0.5 bg-copper-500/30 sm:block"
            aria-hidden
          />
          <ol className="space-y-6">
            {STEP_KEYS.map((key, i) => (
              <motion.li
                key={key}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative flex items-center gap-5 sm:pl-0"
              >
                <span className="z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-wood-800 text-sm font-bold text-cream-100 dark:bg-copper-500 dark:text-charcoal-950">
                  {i + 1}
                </span>
                <span className="text-lg font-medium text-wood-800 dark:text-cream-100">
                  {t(`process.steps.${key}`)}
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
