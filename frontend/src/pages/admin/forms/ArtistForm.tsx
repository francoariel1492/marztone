import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { Modal } from '@/components/admin/Modal';
import { ImageField } from '@/components/admin/ImageField';
import { Field, BilingualField, CheckboxField } from '@/components/admin/FormFields';
import { slugify } from '@/utils/slug';
import type { Artist } from '@/types';

interface ArtistFormProps {
  open: boolean;
  artist: Artist | null;
  onClose: () => void;
}

type FormState = {
  name: string;
  stageName: string;
  slug: string;
  biographyEs: string;
  biographyEn: string;
  instrumentUsedEs: string;
  instrumentUsedEn: string;
  imageUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  spotifyUrl: string;
  websiteUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
};

function initial(artist: Artist | null): FormState {
  return {
    name: artist?.name ?? '',
    stageName: artist?.stageName ?? '',
    slug: artist?.slug ?? '',
    biographyEs: artist?.biographyEs ?? '',
    biographyEn: artist?.biographyEn ?? '',
    instrumentUsedEs: artist?.instrumentUsedEs ?? '',
    instrumentUsedEn: artist?.instrumentUsedEn ?? '',
    imageUrl: artist?.imageUrl ?? '',
    instagramUrl: artist?.instagramUrl ?? '',
    youtubeUrl: artist?.youtubeUrl ?? '',
    spotifyUrl: artist?.spotifyUrl ?? '',
    websiteUrl: artist?.websiteUrl ?? '',
    isFeatured: artist?.isFeatured ?? false,
    isPublished: artist?.isPublished ?? true,
    displayOrder: artist?.displayOrder ?? 0,
  };
}

export function ArtistForm({ open, artist, onClose }: ArtistFormProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => initial(artist));
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      artist ? adminApi.updateArtist(artist.id, payload) : adminApi.createArtist(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'artists'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      onClose();
    },
    onError: () => setError('No se pudo guardar. Revisá los campos obligatorios.'),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = (v: string) => (v.trim() === '' ? undefined : v.trim());
    mutation.mutate({
      name: form.name,
      stageName: cleaned(form.stageName),
      slug: form.slug.trim() || slugify(form.stageName || form.name),
      biographyEs: form.biographyEs,
      biographyEn: form.biographyEn,
      instrumentUsedEs: cleaned(form.instrumentUsedEs),
      instrumentUsedEn: cleaned(form.instrumentUsedEn),
      imageUrl: form.imageUrl,
      instagramUrl: cleaned(form.instagramUrl),
      youtubeUrl: cleaned(form.youtubeUrl),
      spotifyUrl: cleaned(form.spotifyUrl),
      websiteUrl: cleaned(form.websiteUrl),
      isFeatured: form.isFeatured,
      isPublished: form.isPublished,
      displayOrder: Number(form.displayOrder) || 0,
    });
  };

  return (
    <Modal open={open} title={artist ? 'Editar artista' : 'Nuevo artista'} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <ImageField label="Fotografía" value={form.imageUrl} onChange={(v) => set('imageUrl', v)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nombre" value={form.name} onChange={(v) => set('name', v)} required />
          <Field label="Nombre artístico" value={form.stageName} onChange={(v) => set('stageName', v)} />
        </div>
        <BilingualField
          label="Biografía"
          valueEs={form.biographyEs}
          valueEn={form.biographyEn}
          onChangeEs={(v) => set('biographyEs', v)}
          onChangeEn={(v) => set('biographyEn', v)}
          textarea
          required
        />
        <BilingualField
          label="Instrumento usado"
          valueEs={form.instrumentUsedEs}
          valueEn={form.instrumentUsedEn}
          onChangeEs={(v) => set('instrumentUsedEs', v)}
          onChangeEn={(v) => set('instrumentUsedEn', v)}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Instagram" value={form.instagramUrl} onChange={(v) => set('instagramUrl', v)} type="url" />
          <Field label="YouTube" value={form.youtubeUrl} onChange={(v) => set('youtubeUrl', v)} type="url" />
          <Field label="Spotify" value={form.spotifyUrl} onChange={(v) => set('spotifyUrl', v)} type="url" />
          <Field label="Sitio web" value={form.websiteUrl} onChange={(v) => set('websiteUrl', v)} type="url" />
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Field label="Orden" value={String(form.displayOrder)} onChange={(v) => set('displayOrder', Number(v))} type="number" />
          <CheckboxField label="Destacado" checked={form.isFeatured} onChange={(v) => set('isFeatured', v)} />
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
