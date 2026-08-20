import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Type, Palette } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { LoadingSpinner, ErrorState } from '@/components/common/States';
import { applyAppearance } from '@/hooks/useAppearance';
import { COLOR_THEMES, HEADING_FONTS, BODY_FONTS } from '@/config/appearance';

export function AppearanceSettings() {
  const queryClient = useQueryClient();
  const [fontHeading, setFontHeading] = useState('Cormorant Garamond');
  const [fontBody, setFontBody] = useState('Inter');
  const [colorTheme, setColorTheme] = useState('cobre');
  const [saved, setSaved] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: adminApi.getSettings,
  });

  useEffect(() => {
    if (data) {
      setFontHeading(data.fontHeading);
      setFontBody(data.fontBody);
      setColorTheme(data.colorTheme);
    }
  }, [data]);

  // Vista previa en vivo mientras se elige
  useEffect(() => {
    applyAppearance({ fontHeading, fontBody, colorTheme });
  }, [fontHeading, fontBody, colorTheme]);

  const mutation = useMutation({
    mutationFn: () => adminApi.updateSettings({ fontHeading, fontBody, colorTheme }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState />;

  return (
    <div className="card max-w-3xl space-y-6 p-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-wood-900 dark:text-cream-100">
          <Palette size={18} /> Apariencia
        </h2>
        <p className="text-sm text-wood-500 dark:text-cream-200/60">
          Elegí tipografías y paleta de color. Los cambios se ven en vivo y se aplican a toda la web
          al guardar.
        </p>
      </div>

      {/* Temas de color */}
      <div>
        <span className="label">Tema de color</span>
        <div className="flex flex-wrap gap-3">
          {COLOR_THEMES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setColorTheme(t.key)}
              aria-pressed={colorTheme === t.key}
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-all ${
                colorTheme === t.key
                  ? 'border-copper-500 ring-2 ring-copper-500/40'
                  : 'border-wood-500/25 dark:border-copper-400/25'
              }`}
            >
              <span
                className="h-5 w-5 rounded-full"
                style={{ backgroundColor: t.swatch }}
                aria-hidden
              />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fuentes */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label flex items-center gap-1">
            <Type size={14} /> Tipografía de títulos
          </span>
          <select className="input" value={fontHeading} onChange={(e) => setFontHeading(e.target.value)}>
            {HEADING_FONTS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label flex items-center gap-1">
            <Type size={14} /> Tipografía de textos
          </span>
          <select className="input" value={fontBody} onChange={(e) => setFontBody(e.target.value)}>
            {BODY_FONTS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-wood-500/15 bg-cream-100 p-5 dark:border-copper-400/15 dark:bg-charcoal-800">
        <p className="font-display text-3xl font-bold text-wood-900 dark:text-cream-100">
          Marz<span className="text-copper-500">Tone</span>
        </p>
        <p className="font-display italic text-copper-500">by Manuel Robles Urquiza</p>
        <p className="mt-2 font-body text-sm text-wood-600 dark:text-cream-200/70">
          Instrumentos con identidad propia. Así se ven los textos con esta combinación.
        </p>
        <span className="mt-3 inline-block rounded-full bg-copper-500 px-3 py-1 text-xs font-semibold text-cream-50">
          Botón de acento
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn-primary" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando…' : 'Guardar apariencia'}
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-700 dark:text-green-400">
            <CheckCircle2 size={16} /> Guardado
          </span>
        )}
      </div>
    </div>
  );
}
