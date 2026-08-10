import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme, type ThemeMode } from '@/store/theme';

const OPTIONS: { mode: ThemeMode; Icon: typeof Sun; key: string }[] = [
  { mode: 'light', Icon: Sun, key: 'theme.light' },
  { mode: 'dark', Icon: Moon, key: 'theme.dark' },
  { mode: 'system', Icon: Monitor, key: 'theme.system' },
];

export function ThemeSelector() {
  const { mode, setMode } = useTheme();
  const { t } = useTranslation();

  return (
    <div
      className="inline-flex items-center rounded-full border border-wood-500/25 p-0.5 dark:border-copper-400/25"
      role="group"
      aria-label={t('theme.toggle')}
    >
      {OPTIONS.map(({ mode: m, Icon, key }) => {
        const active = mode === m;
        return (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={active}
            aria-label={t(key)}
            title={t(key)}
            className={`rounded-full p-1.5 transition-colors ${
              active
                ? 'bg-wood-800 text-cream-100 dark:bg-copper-500 dark:text-charcoal-950'
                : 'text-wood-600 hover:text-wood-900 dark:text-cream-200'
            }`}
          >
            <Icon size={16} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
