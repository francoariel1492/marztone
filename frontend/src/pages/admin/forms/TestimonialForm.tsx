import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { Modal } from '@/components/admin/Modal';
import { ImageField } from '@/components/admin/ImageField';
import { Field, BilingualField, CheckboxField } from '@/components/admin/FormFields';
import type { Testimonial } from '@/types';

interface Props {
  open: boolean;
  testimonial: Testimonial | null;
  onClose: () => void;
}

function initial(t: Testimonial | null) {
  return {
    customerName: t?.customerName ?? '',
    customerImageUrl: t?.customerImageUrl ?? '',
    relatedWorkEs: t?.relatedWorkEs ?? '',
    relatedWorkEn: t?.relatedWorkEn ?? '',
    commentEs: t?.commentEs ?? '',
    commentEn: t?.commentEn ?? '',
    artistUrl: t?.artistUrl ?? '',
    isPublished: t?.isPublished ?? true,
    displayOrder: t?.displayOrder ?? 0,
  };
}

export function TestimonialForm({ open, testimonial, onClose }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => initial(testimonial));
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ReturnType<typeof initial>>(
    key: K,
    value: ReturnType<typeof initial>[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      testimonial
        ? adminApi.updateTestimonial(testimonial.id, payload)
        : adminApi.createTestimonial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      onClose();
    },
    onError: () => setError('No se pudo guardar. Revisá los campos obligatorios.'),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = (v: string) => (v.trim() === '' ? undefined : v.trim());
    mutation.mutate({
      customerName: form.customerName,
      customerImageUrl: cleaned(form.customerImageUrl),
      relatedWorkEs: cleaned(form.relatedWorkEs),
      relatedWorkEn: cleaned(form.relatedWorkEn),
      commentEs: form.commentEs,
      commentEn: form.commentEn,
      artistUrl: cleaned(form.artistUrl),
      isPublished: form.isPublished,
      displayOrder: Number(form.displayOrder) || 0,
    });
  };

  return (
    <Modal
      open={open}
      title={testimonial ? 'Editar testimonio' : 'Nuevo testimonio'}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <ImageField
          label="Foto del cliente (opcional)"
          value={form.customerImageUrl}
          onChange={(v) => set('customerImageUrl', v)}
        />
        <Field label="Nombre del cliente" value={form.customerName} onChange={(v) => set('customerName', v)} required />
        <BilingualField
          label="Comentario"
          valueEs={form.commentEs}
          valueEn={form.commentEn}
          onChangeEs={(v) => set('commentEs', v)}
          onChangeEn={(v) => set('commentEn', v)}
          textarea
          required
        />
        <BilingualField
          label="Trabajo relacionado"
          valueEs={form.relatedWorkEs}
          valueEn={form.relatedWorkEn}
          onChangeEs={(v) => set('relatedWorkEs', v)}
          onChangeEn={(v) => set('relatedWorkEn', v)}
        />
        <div className="flex flex-wrap items-center gap-6">
          <Field label="Enlace al artista" value={form.artistUrl} onChange={(v) => set('artistUrl', v)} type="url" />
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
