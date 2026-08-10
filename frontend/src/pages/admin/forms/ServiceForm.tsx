import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { Modal } from '@/components/admin/Modal';
import { Field, BilingualField, CheckboxField } from '@/components/admin/FormFields';
import { slugify } from '@/utils/slug';
import type { Service } from '@/types';

interface Props {
  open: boolean;
  service: Service | null;
  onClose: () => void;
}

function initial(s: Service | null) {
  return {
    slug: s?.slug ?? '',
    titleEs: s?.titleEs ?? '',
    titleEn: s?.titleEn ?? '',
    descriptionEs: s?.descriptionEs ?? '',
    descriptionEn: s?.descriptionEn ?? '',
    icon: s?.icon ?? '',
    whatsappMessageEs: s?.whatsappMessageEs ?? '',
    whatsappMessageEn: s?.whatsappMessageEn ?? '',
    isActive: s?.isActive ?? true,
    displayOrder: s?.displayOrder ?? 0,
  };
}

export function ServiceForm({ open, service, onClose }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => initial(service));
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ReturnType<typeof initial>>(
    key: K,
    value: ReturnType<typeof initial>[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      service ? adminApi.updateService(service.id, payload) : adminApi.createService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      onClose();
    },
    onError: () => setError('No se pudo guardar. Revisá los campos obligatorios.'),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = (v: string) => (v.trim() === '' ? undefined : v.trim());
    mutation.mutate({
      slug: form.slug.trim() || slugify(form.titleEs),
      titleEs: form.titleEs,
      titleEn: form.titleEn,
      descriptionEs: form.descriptionEs,
      descriptionEn: form.descriptionEn,
      icon: cleaned(form.icon),
      whatsappMessageEs: cleaned(form.whatsappMessageEs),
      whatsappMessageEn: cleaned(form.whatsappMessageEn),
      isActive: form.isActive,
      displayOrder: Number(form.displayOrder) || 0,
    });
  };

  return (
    <Modal open={open} title={service ? 'Editar servicio' : 'Nuevo servicio'} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <BilingualField
          label="Título"
          valueEs={form.titleEs}
          valueEn={form.titleEn}
          onChangeEs={(v) => set('titleEs', v)}
          onChangeEn={(v) => set('titleEn', v)}
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
        <Field
          label="Icono (nombre de Lucide, ej: Wrench, Guitar, Hammer)"
          value={form.icon}
          onChange={(v) => set('icon', v)}
        />
        <BilingualField
          label="Mensaje de WhatsApp"
          valueEs={form.whatsappMessageEs}
          valueEn={form.whatsappMessageEn}
          onChangeEs={(v) => set('whatsappMessageEs', v)}
          onChangeEn={(v) => set('whatsappMessageEn', v)}
          textarea
        />
        <div className="flex flex-wrap items-center gap-6">
          <Field label="Orden" value={String(form.displayOrder)} onChange={(v) => set('displayOrder', Number(v))} type="number" />
          <CheckboxField label="Activo" checked={form.isActive} onChange={(v) => set('isActive', v)} />
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
