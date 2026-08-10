import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { LoadingSpinner, ErrorState } from '@/components/common/States';
import type { SiteSettings } from '@/types';

export interface SettingsField {
  key: keyof SiteSettings;
  label: string;
  type?: 'text' | 'textarea' | 'url';
}

/** Formulario reutilizable para editar un subconjunto de SiteSettings. */
export function SettingsForm({ title, fields }: { title: string; fields: SettingsField[] }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Partial<SiteSettings>>({});
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: adminApi.getSettings,
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  // Advertencia al salir con cambios sin guardar
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<SiteSettings>) => adminApi.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setStatus('success');
      setDirty(false);
    },
    onError: () => setStatus('error'),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState />;

  const update = (key: keyof SiteSettings, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setStatus('idle');
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<SiteSettings> = {};
    fields.forEach((f) => {
      payload[f.key] = (form[f.key] ?? '') as never;
    });
    mutation.mutate(payload);
  };

  return (
    <form onSubmit={onSubmit} className="card max-w-3xl space-y-5 p-6">
      <h2 className="text-lg font-semibold text-wood-900 dark:text-cream-100">{title}</h2>
      {fields.map((field) => (
        <div key={String(field.key)}>
          <label className="label" htmlFor={String(field.key)}>
            {field.label}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={String(field.key)}
              rows={3}
              className="input resize-y"
              value={(form[field.key] as string) ?? ''}
              onChange={(e) => update(field.key, e.target.value)}
            />
          ) : (
            <input
              id={String(field.key)}
              type={field.type === 'url' ? 'url' : 'text'}
              className="input"
              value={(form[field.key] as string) ?? ''}
              onChange={(e) => update(field.key, e.target.value)}
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button type="submit" className="btn-primary" disabled={mutation.isPending || !dirty}>
          {mutation.isPending ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {status === 'success' && (
          <span className="flex items-center gap-1 text-sm text-green-700 dark:text-green-400">
            <CheckCircle2 size={16} /> Guardado
          </span>
        )}
        {status === 'error' && (
          <span className="flex items-center gap-1 text-sm text-red-600" role="alert">
            <AlertCircle size={16} /> Error al guardar
          </span>
        )}
      </div>
    </form>
  );
}
