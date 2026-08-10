import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { LoadingSpinner, ErrorState } from '@/components/common/States';
import type { PageSection } from '@/types';

export function SectionsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'sections'],
    queryFn: adminApi.getSections,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="space-y-6">
      {data.map((section) => (
        <SectionEditor
          key={section.id}
          section={section}
          onSaved={() => queryClient.invalidateQueries({ queryKey: ['sections'] })}
        />
      ))}
    </div>
  );
}

function SectionEditor({ section, onSaved }: { section: PageSection; onSaved: () => void }) {
  const queryClient = useQueryClient();
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [form, setForm] = useState<PageSection>(section);
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload: Partial<PageSection>) => adminApi.updateSection(section.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sections'] });
      onSaved();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const suffix = lang === 'es' ? 'Es' : 'En';
  const titleKey = `title${suffix}` as keyof PageSection;
  const subtitleKey = `subtitle${suffix}` as keyof PageSection;
  const contentKey = `content${suffix}` as keyof PageSection;

  const set = (key: keyof PageSection, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(form);
      }}
      className="card p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-wood-900 dark:text-cream-100">
          {section.key} <span className="text-xs text-wood-500">#{section.displayOrder}</span>
        </h3>
        <div className="flex rounded-lg border border-wood-500/25 p-0.5 text-sm">
          {(['es', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`rounded-md px-3 py-1 ${
                lang === l ? 'bg-wood-800 text-cream-100 dark:bg-copper-500 dark:text-charcoal-950' : ''
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="label">Título ({suffix})</label>
          <input
            className="input"
            value={(form[titleKey] as string) ?? ''}
            onChange={(e) => set(titleKey, e.target.value)}
          />
        </div>
        <div>
          <label className="label">Subtítulo ({suffix})</label>
          <input
            className="input"
            value={(form[subtitleKey] as string) ?? ''}
            onChange={(e) => set(subtitleKey, e.target.value)}
          />
        </div>
        <div>
          <label className="label">Contenido ({suffix})</label>
          <textarea
            rows={3}
            className="input resize-y"
            value={(form[contentKey] as string) ?? ''}
            onChange={(e) => set(contentKey, e.target.value)}
          />
        </div>
        <div>
          <label className="label">Imagen (URL)</label>
          <input
            className="input"
            value={form.imageUrl ?? ''}
            onChange={(e) => set('imageUrl', e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-wood-700 dark:text-cream-200">
          <input
            type="checkbox"
            className="h-4 w-4 accent-copper-500"
            checked={form.isVisible}
            onChange={(e) => set('isVisible', e.target.checked)}
          />
          Visible en la web
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando…' : 'Guardar'}
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-700">
            <CheckCircle2 size={16} /> Guardado
          </span>
        )}
      </div>
    </form>
  );
}
