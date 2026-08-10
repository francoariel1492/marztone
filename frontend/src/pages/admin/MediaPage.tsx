import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Upload, Trash2, Copy, Check } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/common/States';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

export function MediaPage() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'media'],
    queryFn: () => adminApi.getMedia({ limit: 60 }),
  });

  const upload = useMutation({
    mutationFn: (file: File) => adminApi.uploadMedia(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'media'] }),
    onError: () => setError('No se pudo subir la imagen. Verificá formato y tamaño.'),
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
      setToDelete(null);
    },
  });

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="space-y-6">
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            setError(null);
            const file = e.target.files?.[0];
            if (file) upload.mutate(file);
            e.target.value = '';
          }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="btn-primary"
          disabled={upload.isPending}
        >
          <Upload size={18} /> {upload.isPending ? 'Subiendo…' : 'Subir imagen'}
        </button>
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>

      {data.data.length === 0 ? (
        <EmptyState message="No hay imágenes en la biblioteca." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.data.map((media) => (
            <div key={media.id} className="card overflow-hidden">
              <div className="aspect-square overflow-hidden bg-cream-200 dark:bg-charcoal-800">
                <img src={media.url} alt={media.altEs ?? media.originalName} className="h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <p className="truncate text-xs text-wood-600 dark:text-cream-200/60" title={media.originalName}>
                  {media.originalName}
                </p>
                <p className="text-xs text-wood-500 dark:text-cream-200/50">
                  {(media.size / 1024).toFixed(0)} KB
                  {media.width ? ` · ${media.width}×${media.height}` : ''}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => copyUrl(media.url)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-wood-500/25 py-1.5 text-xs"
                  >
                    {copied === media.url ? <Check size={14} /> : <Copy size={14} />}
                    URL
                  </button>
                  <button
                    onClick={() => setToDelete(media.id)}
                    aria-label="Eliminar"
                    className="rounded-lg p-1.5 text-red-600 hover:bg-red-600/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Eliminar imagen"
        message="Si la imagen está en uso, deberás actualizar el contenido donde aparece. ¿Continuar?"
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete)}
      />
    </div>
  );
}
