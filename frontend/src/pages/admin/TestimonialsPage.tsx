import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, Eye, EyeOff, Pencil, Plus } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/common/States';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { TestimonialForm } from './forms/TestimonialForm';
import type { Testimonial } from '@/types';

export function TestimonialsPage() {
  const queryClient = useQueryClient();
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'testimonials'],
    queryFn: adminApi.getTestimonials,
  });

  const toggle = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      adminApi.updateTestimonial(id, { isPublished }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      setToDelete(null);
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary" onClick={() => setCreating(true)}>
          <Plus size={18} /> Nuevo testimonio
        </button>
      </div>

      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.map((testimonial) => (
            <div key={testimonial.id} className="card flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium text-wood-900 dark:text-cream-100">
                  {testimonial.customerName}
                </p>
                <p className="line-clamp-3 text-sm text-wood-500 dark:text-cream-200/60">
                  “{testimonial.commentEs}”
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-1">
                <button
                  onClick={() => setEditing(testimonial)}
                  aria-label="Editar"
                  className="p-1 text-wood-600 hover:text-copper-500 dark:text-cream-200"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() =>
                    toggle.mutate({ id: testimonial.id, isPublished: !testimonial.isPublished })
                  }
                  className="text-copper-500"
                  aria-label={testimonial.isPublished ? 'Ocultar' : 'Publicar'}
                >
                  {testimonial.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                  onClick={() => setToDelete(testimonial.id)}
                  aria-label="Eliminar"
                  className="rounded-lg p-1 text-red-600 hover:bg-red-600/10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TestimonialForm open={creating} testimonial={null} onClose={() => setCreating(false)} />
      <TestimonialForm open={!!editing} testimonial={editing} onClose={() => setEditing(null)} />

      <ConfirmDialog
        open={!!toDelete}
        title="Eliminar testimonio"
        message="¿Seguro que querés eliminar este testimonio?"
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete)}
      />
    </div>
  );
}
