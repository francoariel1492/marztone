import { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import { adminApi } from '@/api/admin';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

/** Campo de imagen: permite subir un archivo desde la laptop o pegar un link. */
export function ImageField({ label, value, onChange }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const media = await adminApi.uploadMedia(file);
      onChange(media.url);
    } catch {
      setError('No se pudo subir. Verificá formato (JPG/PNG/WebP/AVIF) y tamaño (máx 5 MB).');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {value ? (
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-wood-500/20">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              aria-label="Quitar imagen"
              className="absolute right-1 top-1 rounded-full bg-charcoal-950/70 p-1 text-cream-100"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg border border-dashed border-wood-500/30 text-xs text-wood-500">
            Sin imagen
          </div>
        )}

        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn-outline w-full !py-2 text-sm"
          >
            <Upload size={16} /> {uploading ? 'Subiendo…' : 'Subir desde tu laptop'}
          </button>
          <div className="flex items-center gap-2">
            <LinkIcon size={14} className="text-wood-500" aria-hidden />
            <input
              type="url"
              placeholder="…o pegá un link de imagen (https://…)"
              className="input !py-2 text-sm"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
