import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { Modal } from '@/components/admin/Modal';
import { ImageField } from '@/components/admin/ImageField';
import { Field, BilingualField, CheckboxField } from '@/components/admin/FormFields';
import type { WorkshopImage } from '@/types';

interface Props {
  open: boolean;
  image: WorkshopImage | null;
  onClose: () => void;
}

function initial(w: WorkshopImage | null) {
  return {
    titleEs: w?.titleEs ?? '',
    titleEn: w?.titleEn ?? '',
    descriptionEs: w?.descriptionEs ?? '',
    descriptionEn: w?.descriptionEn ?? '',
    imageUrl: w?.imageUrl ?? '',
    altEs: w?.altEs ?? '',
    altEn: w?.altEn ?? '',
    isPublished: w?.isPublished ?? true,
    displayOrder: w?.displayOrder ?? 0,
  };
}

export function WorkshopForm({ open, image, onClose }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => initial(image));
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ReturnType<typeof initial>>(
    key: K,
    value: ReturnType<typeof initial>[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      image ? adminApi.updateWorkshop(image.id, payload) : adminApi.createWorkshop(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'workshop'] });
      queryClient.invalidateQueries({ queryKey: ['workshop'] });
      onClose();
    },
    onError: () => setError('No se pudo guardar. Cargá una imagen y los textos alternativos.'),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.imageUrl) {
      setError('Tenés que subir o enlazar una imagen.');
      return;
    }
    const cleaned = (v: string) => (v.trim() === '' ? undefined : v.trim());
    mutation.mutate({
      titleEs: cleaned(form.titleEs),
      titleEn: cleaned(form.titleEn),
      descriptionEs: cleaned(form.descriptionEs),
      descriptionEn: cleaned(form.descriptionEn),
      imageUrl: form.imageUrl,
      altEs: form.altEs || form.titleEs || 'Taller MarzTone',
      altEn: form.altEn || form.titleEn || 'MarzTone workshop',
      isPublished: form.isPublished,
      displayOrder: Number(form.displayOrder) || 0,
    });
  };

  return (
    <Modal
      open={open}
      title={image ? 'Editar imagen del taller' : 'Nueva imagen del taller'}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <ImageField label="Imagen" value={form.imageUrl} onChange={(v) => set('imageUrl', v)} />
        <BilingualField
          label="Título"
          valueEs={form.titleEs}
          valueEn={form.titleEn}
          onChangeEs={(v) => set('titleEs', v)}
          onChangeEn={(v) => set('titleEn', v)}
        />
        <BilingualField
          label="Texto alternativo (alt)"
          valueEs={form.altEs}
          valueEn={form.altEn}
          onChangeEs={(v) => set('altEs', v)}
          onChangeEn={(v) => set('altEn', v)}
        />
        <div className="flex flex-wrap items-center gap-6">
          <Field label="Orden" value={String(form.displayOrder)} onChange={(v) => set('displayOrder', Number(v))} type="number" />
          <CheckboxField label="Publicado" checked={form.isPublished} onChange={(v) => set('isPublished', v)} />
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
