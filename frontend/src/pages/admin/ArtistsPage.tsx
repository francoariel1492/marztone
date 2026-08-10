import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, Eye, EyeOff, Pencil, Plus } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/common/States';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ArtistForm } from './forms/ArtistForm';
import type { Artist } from '@/types';

export function ArtistsPage() {
  const queryClient = useQueryClient();
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<Artist | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'artists'],
    queryFn: () => adminApi.getArtists({ limit: 50 }),
  });

  const toggle = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      adminApi.updateArtist(id, { isPublished }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'artists'] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteArtist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'artists'] });
      setToDelete(null);
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary" onClick={() => setCreating(true)}>
          <Plus size={18} /> Nuevo artista
        </button>
      </div>

      {data.data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((artist) => (
            <div key={artist.id} className="card flex items-center gap-4 p-4">
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-wood-900 dark:text-cream-100">
                  {artist.stageName ?? artist.name}
                </p>
                <p className="truncate text-sm text-wood-500 dark:text-cream-200/60">
                  {artist.instrumentUsedEs}
                </p>
              </div>
              <button
                onClick={() => setEditing(artist)}
                aria-label="Editar"
                className="rounded-lg p-2 text-wood-600 hover:bg-wood-500/10 dark:text-cream-200"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => toggle.mutate({ id: artist.id, isPublished: !artist.isPublished })}
                className="text-copper-500"
                aria-label={artist.isPublished ? 'Ocultar' : 'Publicar'}
              >
                {artist.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button
                onClick={() => setToDelete(artist.id)}
                aria-label="Eliminar"
                className="rounded-lg p-2 text-red-600 hover:bg-red-600/10"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ArtistForm open={creating} artist={null} onClose={() => setCreating(false)} />
      <ArtistForm open={!!editing} artist={editing} onClose={() => setEditing(null)} />

      <ConfirmDialog
        open={!!toDelete}
        title="Eliminar artista"
        message="El artista se archivará (soft delete). ¿Continuar?"
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete)}
      />
    </div>
  );
}
