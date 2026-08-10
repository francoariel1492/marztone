import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Service, SiteSettings } from '@/types';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import { whatsappFromSettings } from '@/utils/whatsapp';

interface ServiceCardProps {
  service: Service;
  settings?: SiteSettings;
  index: number;
}

export function ServiceCard({ service, settings, index }: ServiceCardProps) {
  const { t } = useTranslation();
  const { pick, isEn } = useLocalizedContent();

  const IconComponent =
    (service.icon && (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon]) ||
    Icons.Wrench;

  const waUrl = settings
    ? whatsappFromSettings(settings, isEn, pick(service, 'whatsappMessage') as string | null)
    : '#';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="card flex flex-col p-6"
    >
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-wood-800/10 text-copper-500 dark:bg-copper-400/10">
        <IconComponent size={24} aria-hidden />
      </span>
      <h3 className="text-lg font-semibold text-wood-900 dark:text-cream-100">
        {pick(service, 'title') as string}
      </h3>
      <p className="mt-2 flex-1 text-sm text-wood-600 dark:text-cream-200/70">
        {pick(service, 'description') as string}
      </p>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-copper-500 hover:text-copper-600"
      >
        {t('common.consult')} →
      </a>
    </motion.article>
  );
}
