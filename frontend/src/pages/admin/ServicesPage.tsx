import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, Eye, EyeOff, Pencil, Plus } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/common/States';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ServiceForm } from './forms/ServiceForm';
import type { Service } from '@/types';

export function ServicesPage() {
  const queryClient = useQueryClient();
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'services'],
    queryFn: adminApi.getServices,
  });

  const toggle = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.updateService(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'services'] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      setToDelete(null);
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary" onClick={() => setCreating(true)}>
          <Plus size={18} /> Nuevo servicio
        </button>
      </div>

      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((service) => (
            <div key={service.id} className="card flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium text-wood-900 dark:text-cream-100">{service.titleEs}</p>
                <p className="line-clamp-2 text-sm text-wood-500 dark:text-cream-200/60">
                  {service.descriptionEs}
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-1">
                <button
                  onClick={() => setEditing(service)}
                  aria-label="Editar"
                  className="p-1 text-wood-600 hover:text-copper-500 dark:text-cream-200"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => toggle.mutate({ id: service.id, isActive: !service.isActive })}
                  className="text-copper-500"
                  aria-label={service.isActive ? 'Desactivar' : 'Activar'}
                >
                  {service.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                  onClick={() => setToDelete(service.id)}
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

      <ServiceForm open={creating} service={null} onClose={() => setCreating(false)} />
      <ServiceForm open={!!editing} service={editing} onClose={() => setEditing(null)} />

      <ConfirmDialog
        open={!!toDelete}
        title="Eliminar servicio"
        message="¿Seguro que querés eliminar este servicio?"
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete)}
      />
    </div>
  );
}
