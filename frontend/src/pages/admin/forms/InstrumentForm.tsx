import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, Plus } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { Modal } from '@/components/admin/Modal';
import { ImageField } from '@/components/admin/ImageField';
import { Field, BilingualField, CheckboxField } from '@/components/admin/FormFields';
import { slugify } from '@/utils/slug';
import type { Instrument, InstrumentStatus } from '@/types';

interface Props {
  open: boolean;
  instrument: Instrument | null;
  onClose: () => void;
}

interface GalleryItem {
  imageUrl: string;
  altEs: string;
  altEn: string;
}

const STATUS_OPTIONS: { value: InstrumentStatus; label: string }[] = [
  { value: 'AVAILABLE', label: 'Disponible' },
  { value: 'SOLD', label: 'Vendido' },
  { value: 'MADE_TO_ORDER', label: 'Por encargo' },
];

function initial(i: Instrument | null) {
  return {
    slug: i?.slug ?? '',
    nameEs: i?.nameEs ?? '',
    nameEn: i?.nameEn ?? '',
    descriptionEs: i?.descriptionEs ?? '',
    descriptionEn: i?.descriptionEn ?? '',
    materialsEs: i?.materialsEs ?? '',
    materialsEn: i?.materialsEn ?? '',
    specificationsEs: i?.specificationsEs ?? '',
    specificationsEn: i?.specificationsEn ?? '',
    status: i?.status ?? ('AVAILABLE' as InstrumentStatus),
    price: i?.price ?? '',
    currency: i?.currency ?? 'EUR',
    mainImageUrl: i?.mainImageUrl ?? '',
    youtubeUrl: i?.youtubeUrl ?? '',
    whatsappMessageEs: i?.whatsappMessageEs ?? '',
    whatsappMessageEn: i?.whatsappMessageEn ?? '',
    categoryId: i?.categoryId ?? '',
    isFeatured: i?.isFeatured ?? false,
    isPublished: i?.isPublished ?? true,
    displayOrder: i?.displayOrder ?? 0,
  };
}

export function InstrumentForm({ open, instrument, onClose }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => initial(instrument));
  const [gallery, setGallery] = useState<GalleryItem[]>(
    () =>
      instrument?.images.map((img) => ({
        imageUrl: img.imageUrl,
        altEs: img.altEs,
        altEn: img.altEn,
      })) ?? [],
  );
  const [error, setError] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: adminApi.getCategories,
  });

  const set = <K extends keyof ReturnType<typeof initial>>(
    key: K,
    value: ReturnType<typeof initial>[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      instrument
        ? adminApi.updateInstrument(instrument.id, payload)
        : adminApi.createInstrument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'instruments'] });
      queryClient.invalidateQueries({ queryKey: ['instruments'] });
      onClose();
    },
    onError: () => setError('No se pudo guardar. Revisá imagen principal, categoría y textos.'),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.mainImageUrl) return setError('Cargá la imagen principal.');
    if (!form.categoryId) return setError('Elegí una categoría.');
    const cleaned = (v: string) => (v.trim() === '' ? undefined : v.trim());
    mutation.mutate({
      slug: form.slug.trim() || slugify(form.nameEs),
      nameEs: form.nameEs,
      nameEn: form.nameEn,
      descriptionEs: form.descriptionEs,
      descriptionEn: form.descriptionEn,
      materialsEs: cleaned(form.materialsEs),
      materialsEn: cleaned(form.materialsEn),
      specificationsEs: cleaned(form.specificationsEs),
      specificationsEn: cleaned(form.specificationsEn),
      status: form.status,
      price: form.price === '' ? undefined : Number(form.price),
      currency: cleaned(form.currency),
      mainImageUrl: form.mainImageUrl,
      youtubeUrl: cleaned(form.youtubeUrl),
      whatsappMessageEs: cleaned(form.whatsappMessageEs),
      whatsappMessageEn: cleaned(form.whatsappMessageEn),
      categoryId: form.categoryId,
      isFeatured: form.isFeatured,
      isPublished: form.isPublished,
      displayOrder: Number(form.displayOrder) || 0,
      images: gallery
        .filter((g) => g.imageUrl)
        .map((g, idx) => ({
          imageUrl: g.imageUrl,
          altEs: g.altEs || form.nameEs,
          altEn: g.altEn || form.nameEn,
          displayOrder: idx,
        })),
    });
  };

  const updateGallery = (idx: number, patch: Partial<GalleryItem>) =>
    setGallery((prev) => prev.map((g, i) => (i === idx ? { ...g, ...patch } : g)));

  return (
    <Modal
      open={open}
      title={instrument ? 'Editar instrumento' : 'Nuevo instrumento'}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <ImageField
          label="Imagen principal"
          value={form.mainImageUrl}
          onChange={(v) => set('mainImageUrl', v)}
        />
        <BilingualField
          label="Nombre"
          valueEs={form.nameEs}
          valueEn={form.nameEn}
          onChangeEs={(v) => set('nameEs', v)}
          onChangeEn={(v) => set('nameEn', v)}
          required
        />
        <BilingualField
          label="Descripción"
          valueEs={form.descriptionEs}
          valueEn={form.descriptionEn}
          onChangeEs={(v) => set('descriptionEs', v)}
          onChangeEn={(v) => set('descriptionEn', v)}
          textarea
          required
        />
        <BilingualField
          label="Materiales"
          valueEs={form.materialsEs}
          valueEn={form.materialsEn}
          onChangeEs={(v) => set('materialsEs', v)}
          onChangeEn={(v) => set('materialsEn', v)}
          textarea
        />
        <BilingualField
          label="Especificaciones"
          valueEs={form.specificationsEs}
          valueEn={form.specificationsEn}
          onChangeEs={(v) => set('specificationsEs', v)}
          onChangeEn={(v) => set('specificationsEn', v)}
          textarea
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="label">Categoría *</span>
            <select
              className="input"
              value={form.categoryId}
              onChange={(e) => set('categoryId', e.target.value)}
            >
              <option value="">— Elegí una —</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameEs}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label">Estado</span>
            <select
              className="input"
              value={form.status}
              onChange={(e) => set('status', e.target.value as InstrumentStatus)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <Field label="Precio (opcional)" value={String(form.price)} onChange={(v) => set('price', v)} type="number" />
          <Field label="Moneda" value={form.currency} onChange={(v) => set('currency', v)} />
          <Field label="YouTube (URL)" value={form.youtubeUrl} onChange={(v) => set('youtubeUrl', v)} type="url" />
          <Field label="Orden" value={String(form.displayOrder)} onChange={(v) => set('displayOrder', Number(v))} type="number" />
        </div>

        <BilingualField
          label="Mensaje de WhatsApp"
          valueEs={form.whatsappMessageEs}
          valueEn={form.whatsappMessageEn}
          onChangeEs={(v) => set('whatsappMessageEs', v)}
          onChangeEn={(v) => set('whatsappMessageEn', v)}
          textarea
        />

        <div className="flex flex-wrap items-center gap-6">
          <CheckboxField label="Destacado" checked={form.isFeatured} onChange={(v) => set('isFeatured', v)} />
          <CheckboxField label="Publicado" checked={form.isPublished} onChange={(v) => set('isPublished', v)} />
        </div>

        {/* Galería */}
        <div className="rounded-xl border border-wood-500/15 p-4 dark:border-copper-400/15">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-wood-800 dark:text-cream-100">
              Galería de imágenes
            </span>
            <button
              type="button"
              className="btn-outline !py-1.5 text-xs"
              onClick={() => setGallery((prev) => [...prev, { imageUrl: '', altEs: '', altEn: '' }])}
            >
              <Plus size={14} /> Agregar
            </button>
          </div>
          {gallery.length === 0 && (
            <p className="text-sm text-wood-500 dark:text-cream-200/60">Sin imágenes en la galería.</p>
          )}
          <div className="space-y-4">
            {gallery.map((item, idx) => (
              <div key={idx} className="rounded-lg bg-cream-100 p-3 dark:bg-charcoal-800">
                <div className="mb-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setGallery((prev) => prev.filter((_, i) => i !== idx))}
                    aria-label="Quitar de la galería"
                    className="text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <ImageField
                  label={`Imagen ${idx + 1}`}
                  value={item.imageUrl}
                  onChange={(v) => updateGallery(idx, { imageUrl: v })}
                />
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-3 border-t border-wood-500/15 pt-4 dark:border-copper-400/15">
          <button type="button" className="btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
