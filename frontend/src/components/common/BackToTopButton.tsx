import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function BackToTopButton() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('common.backToTop')}
      className="fixed bottom-24 right-6 z-40 rounded-full border border-wood-500/25 bg-cream-50 p-3 text-wood-800 shadow-soft transition-colors hover:bg-cream-200 dark:border-copper-400/25 dark:bg-charcoal-900 dark:text-cream-100"
    >
      <ArrowUp size={20} aria-hidden />
    </button>
  );
}
