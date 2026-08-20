import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { LoadingSpinner, ErrorState } from '@/components/common/States';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { SECTION_LAYOUT_OPTIONS } from '@/utils/sectionLayout';
import { LayoutPreview } from '@/components/admin/LayoutPreview';
import type { PageSection } from '@/types';

// Secciones con comportamiento propio (galerías, formularios, colecciones).
// Las creadas por el admin son "personalizadas" y se renderizan como bloque de contenido.
const SYSTEM_KEYS = ['hero', 'about', 'workshop', 'instruments', 'artists', 'contact'];

export function SectionsPage() {
  const queryClient = useQueryClient();
  const [toDelete, setToDelete] = useState<PageSection | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'sections'],
    queryFn: adminApi.getSections,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'sections'] });
    queryClient.invalidateQueries({ queryKey: ['sections'] });
  };

  const reorder = useMutation({
    mutationFn: async ({ a, b }: { a: PageSection; b: PageSection }) => {
      await Promise.all([
        adminApi.updateSection(a.id, { displayOrder: b.displayOrder }),
        adminApi.updateSection(b.id, { displayOrder: a.displayOrder }),
      ]);
    },
    onSuccess: invalidate,
  });

  const create = useMutation({
    mutationFn: () =>
      adminApi.createSection({
        label: 'Nueva sección',
        layout: 'texto-centrado',
        titleEs: 'Nueva sección',
        titleEn: 'New section',
        isVisible: false,
      }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteSection(id),
    onSuccess: () => {
      invalidate();
      setToDelete(null);
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorState />;

  const sorted = [...data].sort((x, y) => x.displayOrder - y.displayOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-wood-600 dark:text-cream-200/60">
          Editá el contenido, elegí el diseño, reordená o agregá secciones nuevas.
        </p>
        <button className="btn-primary" onClick={() => create.mutate()} disabled={create.isPending}>
          <Plus size={18} /> {create.isPending ? 'Creando…' : 'Nueva sección'}
        </button>
      </div>

      {sorted.map((section, index) => (
        <SectionEditor
          key={section.id}
          section={section}
          isFirst={index === 0}
          isLast={index === sorted.length - 1}
          reordering={reorder.isPending}
          isSystem={SYSTEM_KEYS.includes(section.key)}
          onMoveUp={() => reorder.mutate({ a: section, b: sorted[index - 1] })}
          onMoveDown={() => reorder.mutate({ a: section, b: sorted[index + 1] })}
          onDelete={() => setToDelete(section)}
          onSaved={() => queryClient.invalidateQueries({ queryKey: ['sections'] })}
        />
      ))}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar sección"
        message={
          toDelete && SYSTEM_KEYS.includes(toDelete.key)
            ? `"${toDelete.label || toDelete.key}" es una sección del sistema. Si la eliminás dejará de mostrarse su contenido especial (galería, formulario o listado). ¿Continuar?`
            : `¿Seguro que querés eliminar la sección "${toDelete?.label || toDelete?.key}"? Esta acción no se puede deshacer.`
        }
        onConfirm={() => toDelete && remove.mutate(toDelete.id)}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

interface SectionEditorProps {
  section: PageSection;
  isFirst: boolean;
  isLast: boolean;
  reordering: boolean;
  isSystem: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onSaved: () => void;
}

function SectionEditor({
  section,
  isFirst,
  isLast,
  reordering,
  isSystem,
  onMoveUp,
  onMoveDown,
  onDelete,
  onSaved,
}: SectionEditorProps) {
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
        // Enviar solo los campos que acepta el DTO del backend (whitelist).
        const payload: Partial<PageSection> = {
          label: form.label,
          layout: form.layout,
          titleEs: form.titleEs,
          titleEn: form.titleEn,
          subtitleEs: form.subtitleEs,
          subtitleEn: form.subtitleEn,
          contentEs: form.contentEs,
          contentEn: form.contentEn,
          imageUrl: form.imageUrl,
          isVisible: form.isVisible,
          displayOrder: form.displayOrder,
        };
        mutation.mutate(payload);
      }}
      className="card p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-wood-900 dark:text-cream-100">
          {form.label || section.key}{' '}
          <span className="text-xs text-wood-500">
            ({section.key})
            {!isSystem && (
              <span className="ml-1 rounded bg-copper-500/15 px-1.5 py-0.5 text-[10px] font-medium text-copper-600 dark:text-copper-400">
                personalizada
              </span>
            )}
          </span>
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={isFirst || reordering}
              aria-label="Subir sección"
              className="rounded p-1 text-wood-600 hover:bg-wood-500/10 disabled:opacity-30 dark:text-cream-200"
            >
              <ChevronUp size={16} />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={isLast || reordering}
              aria-label="Bajar sección"
              className="rounded p-1 text-wood-600 hover:bg-wood-500/10 disabled:opacity-30 dark:text-cream-200"
            >
              <ChevronDown size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Eliminar sección"
            className="rounded p-2 text-red-600 hover:bg-red-600/10"
          >
            <Trash2 size={16} />
          </button>
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
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Nombre de la sección</label>
          <input
            className="input"
            value={form.label}
            onChange={(e) => set('label', e.target.value)}
            placeholder={section.key}
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="label mb-2 block">Diseño (layout)</label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SECTION_LAYOUT_OPTIONS.map((opt) => {
            const active = form.layout === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => set('layout', opt.value)}
                aria-pressed={active}
                className={`flex flex-col gap-2 rounded-xl border p-2 text-left transition-colors ${
                  active
                    ? 'border-copper-500 ring-2 ring-copper-500/40'
                    : 'border-wood-500/20 hover:border-copper-400/60'
                }`}
              >
                <LayoutPreview layout={opt.value} />
                <span
                  className={`text-xs font-medium ${
                    active ? 'text-copper-600 dark:text-copper-400' : 'text-wood-600 dark:text-cream-200/70'
                  }`}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
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
