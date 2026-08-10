import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, Trash2, Check } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/common/States';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { ContactMessage } from '@/types';

export function MessagesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'messages', page, search],
    queryFn: () => adminApi.getMessages({ page, limit: 10, search }),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => adminApi.markMessageRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
      setSelected(null);
      setToDelete(null);
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorState />;

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Buscar mensajes…"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="input max-w-sm"
      />

      {data.data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <ul className="space-y-2">
            {data.data.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => {
                    setSelected(m);
                    if (!m.isRead) markRead.mutate(m.id);
                  }}
                  className={`card flex w-full items-center gap-3 p-4 text-left ${
                    selected?.id === m.id ? 'ring-2 ring-copper-500' : ''
                  }`}
                >
                  <span className="text-copper-500">
                    <Mail size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-wood-900 dark:text-cream-100">
                      {m.name} — {m.subject}
                    </span>
                    <span className="block truncate text-sm text-wood-500 dark:text-cream-200/60">
                      {m.email}
                    </span>
                  </span>
                  {!m.isRead && (
                    <span className="h-2.5 w-2.5 rounded-full bg-copper-500" aria-label="No leído" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div>
            {selected ? (
              <div className="card sticky top-24 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-wood-900 dark:text-cream-100">
                      {selected.subject}
                    </h2>
                    <p className="text-sm text-wood-500 dark:text-cream-200/60">
                      {selected.name} · {selected.email}
                      {selected.phone ? ` · ${selected.phone}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setToDelete(selected.id)}
                    aria-label="Eliminar mensaje"
                    className="rounded-lg p-2 text-red-600 hover:bg-red-600/10"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-wood-500/10 px-2 py-1">{selected.inquiryType}</span>
                  <span className="rounded-full bg-wood-500/10 px-2 py-1">{selected.language}</span>
                  {selected.isRead && (
                    <span className="flex items-center gap-1 rounded-full bg-green-600/10 px-2 py-1 text-green-700">
                      <Check size={12} /> Leído
                    </span>
                  )}
                </div>
                <p className="mt-4 whitespace-pre-line text-wood-700 dark:text-cream-200/80">
                  {selected.message}
                </p>
              </div>
            ) : (
              <div className="card flex h-full items-center justify-center p-10 text-wood-500 dark:text-cream-200/60">
                Seleccioná un mensaje para leerlo.
              </div>
            )}
          </div>
        </div>
      )}

      {data.meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-lg text-sm ${
                p === page
                  ? 'bg-wood-800 text-cream-100 dark:bg-copper-500 dark:text-charcoal-950'
                  : 'border border-wood-500/25'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Eliminar mensaje"
        message="¿Seguro que querés eliminar este mensaje? Esta acción no se puede deshacer."
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete)}
      />
    </div>
  );
}
