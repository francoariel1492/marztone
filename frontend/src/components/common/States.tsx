import { useTranslation } from 'react-i18next';

export function LoadingSpinner({ label }: { label?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-wood-500/30 border-t-copper-500"
        aria-hidden
      />
      <span className="text-sm text-wood-600 dark:text-cream-200/70">
        {label ?? t('common.loading')}
      </span>
    </div>
  );
}

export function EmptyState({ message }: { message?: string }) {
  const { t } = useTranslation();
  return (
    <p className="py-12 text-center text-wood-500 dark:text-cream-200/60">
      {message ?? t('common.empty')}
    </p>
  );
}

export function ErrorState({ message }: { message?: string }) {
  const { t } = useTranslation();
  return (
    <p className="py-12 text-center text-red-700 dark:text-red-400" role="alert">
      {message ?? t('common.error')}
    </p>
  );
}
