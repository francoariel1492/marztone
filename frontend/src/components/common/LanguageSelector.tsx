import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'es', label: 'ES', flag: '🇪🇸', name: 'Español' },
  { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
] as const;

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const current = i18n.language.startsWith('en') ? 'en' : 'es';

  return (
    <div
      className="inline-flex items-center rounded-full border border-wood-500/25 p-0.5 dark:border-copper-400/25"
      role="group"
      aria-label={t('language.toggle')}
    >
      {LANGS.map((lang) => {
        const active = current === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => void i18n.changeLanguage(lang.code)}
            aria-pressed={active}
            aria-label={lang.name}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              active
                ? 'bg-wood-800 text-cream-100 dark:bg-copper-500 dark:text-charcoal-950'
                : 'text-wood-600 hover:text-wood-900 dark:text-cream-200'
            }`}
          >
            <span aria-hidden>{lang.flag}</span>
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
