import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Instrument, SiteSettings } from '@/types';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import { whatsappFromSettings } from '@/utils/whatsapp';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

interface InstrumentModalProps {
  instrument: Instrument;
  settings?: SiteSettings;
  onClose: () => void;
}

function youtubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  return match ? match[1] : null;
}

export function InstrumentModal({ instrument, settings, onClose }: InstrumentModalProps) {
  const { t } = useTranslation();
  const { pick, isEn } = useLocalizedContent();
  const [active, setActive] = useState(instrument.mainImageUrl);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const gallery = [
    { imageUrl: instrument.mainImageUrl, alt: pick(instrument, 'name') as string },
    ...instrument.images.map((img) => ({ imageUrl: img.imageUrl, alt: pick(img, 'alt') as string })),
  ];
  const ytId = instrument.youtubeUrl ? youtubeId(instrument.youtubeUrl) : null;
  const waUrl = settings
    ? whatsappFromSettings(settings, isEn, pick(instrument, 'whatsappMessage') as string | null)
    : '#';

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-charcoal-950/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={pick(instrument, 'name') as string}
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-cream-50 shadow-warm dark:bg-charcoal-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-wood-500/15 bg-cream-50/95 px-6 py-4 backdrop-blur dark:border-copper-400/15 dark:bg-charcoal-900/95">
          <h3 className="text-2xl font-semibold text-wood-900 dark:text-cream-100">
            {pick(instrument, 'name') as string}
          </h3>
          <button onClick={onClose} aria-label={t('common.close')} className="p-1">
            <X size={24} />
          </button>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <div className="aspect-square overflow-hidden rounded-xl">
              {showVideo && ytId ? (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                  title={pick(instrument, 'name') as string}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img src={active} alt={pick(instrument, 'name') as string} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActive(img.imageUrl);
                    setShowVideo(false);
                  }}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                    active === img.imageUrl && !showVideo
                      ? 'border-copper-500'
                      : 'border-transparent'
                  }`}
                >
                  <img src={img.imageUrl} alt={img.alt} className="h-full w-full object-cover" />
                </button>
              ))}
              {ytId && (
                <button
                  onClick={() => setShowVideo(true)}
                  aria-label={t('instruments.watchVideo')}
                  className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border-2 border-transparent bg-wood-800 text-cream-100"
                >
                  <Play size={22} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-wood-600 dark:text-cream-200/80">
              {pick(instrument, 'description') as string}
            </p>
            {(pick(instrument, 'materials') as string) && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-copper-500">{t('instruments.materials')}</h4>
                <p className="text-sm text-wood-600 dark:text-cream-200/70">
                  {pick(instrument, 'materials') as string}
                </p>
              </div>
            )}
            {(pick(instrument, 'specifications') as string) && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-copper-500">
                  {t('instruments.specifications')}
                </h4>
                <p className="whitespace-pre-line text-sm text-wood-600 dark:text-cream-200/70">
                  {pick(instrument, 'specifications') as string}
                </p>
              </div>
            )}
            {instrument.price && (
              <p className="mt-4 font-display text-2xl font-semibold text-wood-800 dark:text-copper-400">
                {instrument.price} {instrument.currency}
              </p>
            )}
            <div className="mt-6">
              <WhatsAppButton url={waUrl} label={t('instruments.consultWhatsapp')} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
