import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, Eye, EyeOff, Pencil, Plus } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/common/States';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { WorkshopForm } from './forms/WorkshopForm';
import type { WorkshopImage } from '@/types';

export function WorkshopPage() {
  const queryClient = useQueryClient();
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<WorkshopImage | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'workshop'],
    queryFn: adminApi.getWorkshop,
  });

  const toggle = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      adminApi.updateWorkshop(id, { isPublished }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'workshop'] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteWorkshop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'workshop'] });
      setToDelete(null);
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary" onClick={() => setCreating(true)}>
          <Plus size={18} /> Nueva imagen
        </button>
      </div>

      {data.length === 0 ? (
        <EmptyState message="No hay imágenes del taller. Subilas desde Multimedia y agregalas aquí." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((image) => (
            <div key={image.id} className="card overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={image.imageUrl} alt={image.altEs} className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="truncate text-xs text-wood-600 dark:text-cream-200/60">
                  {image.titleEs ?? image.altEs}
                </span>
                <span className="flex gap-1">
                  <button
                    onClick={() => setEditing(image)}
                    aria-label="Editar"
                    className="text-wood-600 hover:text-copper-500 dark:text-cream-200"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => toggle.mutate({ id: image.id, isPublished: !image.isPublished })}
                    className="text-copper-500"
                    aria-label={image.isPublished ? 'Ocultar' : 'Publicar'}
                  >
                    {image.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => setToDelete(image.id)}
                    aria-label="Eliminar"
                    className="text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <WorkshopForm open={creating} image={null} onClose={() => setCreating(false)} />
      <WorkshopForm open={!!editing} image={editing} onClose={() => setEditing(null)} />

      <ConfirmDialog
        open={!!toDelete}
        title="Eliminar imagen del taller"
        message="¿Seguro que querés eliminar esta imagen de la galería?"
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete)}
      />
    </div>
  );
}
