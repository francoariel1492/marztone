import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, Eye, EyeOff, Star, Pencil, Plus } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/common/States';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { InstrumentForm } from './forms/InstrumentForm';
import type { Instrument } from '@/types';

export function InstrumentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<Instrument | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'instruments', search],
    queryFn: () => adminApi.getInstruments({ limit: 50, search }),
  });

  const toggle = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      adminApi.updateInstrument(id, { isPublished }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'instruments'] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteInstrument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'instruments'] });
      setToDelete(null);
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          placeholder="Buscar instrumentos…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input max-w-sm"
        />
        <button className="btn-primary" onClick={() => setCreating(true)}>
          <Plus size={18} /> Nuevo instrumento
        </button>
      </div>
      <p className="text-sm text-wood-500 dark:text-cream-200/60">
        {data.meta.total} instrumento(s). Tocá el lápiz para editar (incluye galería e imágenes).
      </p>

      {data.data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-wood-500/15 text-xs uppercase text-wood-500 dark:border-copper-400/15">
              <tr>
                <th className="p-3">Instrumento</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Publicado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wood-500/10 dark:divide-copper-400/10">
              {data.data.map((inst) => (
                <tr key={inst.id}>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={inst.mainImageUrl}
                        alt={inst.nameEs}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <span className="font-medium text-wood-900 dark:text-cream-100">
                        {inst.nameEs}
                        {inst.isFeatured && (
                          <Star size={12} className="ml-1 inline text-copper-500" />
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-wood-600 dark:text-cream-200/70">{inst.category.nameEs}</td>
                  <td className="p-3 text-wood-600 dark:text-cream-200/70">{inst.status}</td>
                  <td className="p-3">
                    <button
                      onClick={() => toggle.mutate({ id: inst.id, isPublished: !inst.isPublished })}
                      className="text-copper-500"
                      aria-label={inst.isPublished ? 'Ocultar' : 'Publicar'}
                    >
                      {inst.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setEditing(inst)}
                      aria-label="Editar"
                      className="rounded-lg p-2 text-wood-600 hover:bg-wood-500/10 dark:text-cream-200"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setToDelete(inst.id)}
                      aria-label="Eliminar"
                      className="rounded-lg p-2 text-red-600 hover:bg-red-600/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <InstrumentForm open={creating} instrument={null} onClose={() => setCreating(false)} />
      <InstrumentForm open={!!editing} instrument={editing} onClose={() => setEditing(null)} />

      <ConfirmDialog
        open={!!toDelete}
        title="Eliminar instrumento"
        message="El instrumento se archivará (soft delete). ¿Continuar?"
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete)}
      />
    </div>
  );
}
