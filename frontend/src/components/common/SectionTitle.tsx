import { motion } from 'framer-motion';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string | null;
  center?: boolean;
}

export function SectionTitle({ eyebrow, title, subtitle, center = true }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${center ? 'text-center' : ''}`}
    >
      {eyebrow && (
        <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-copper-500">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold text-wood-900 dark:text-cream-100 sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-wood-600 dark:text-cream-200/80">{subtitle}</p>
      )}
      <div
        className={`mt-4 h-0.5 w-16 rounded-full bg-copper-500/70 ${center ? 'mx-auto' : ''}`}
        aria-hidden
      />
    </motion.div>
  );
}
