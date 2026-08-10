import { motion } from 'framer-motion';
import { Instagram, Youtube, Music2, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Artist } from '@/types';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';

export function ArtistCard({ artist }: { artist: Artist }) {
  const { t } = useTranslation();
  const { pick } = useLocalizedContent();

  const socials = [
    { url: artist.instagramUrl, Icon: Instagram, label: 'Instagram' },
    { url: artist.youtubeUrl, Icon: Youtube, label: 'YouTube' },
    { url: artist.spotifyUrl, Icon: Music2, label: 'Spotify' },
    { url: artist.websiteUrl, Icon: Globe, label: 'Web' },
  ].filter((s) => s.url);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
      className="card overflow-hidden"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={artist.imageUrl}
          alt={artist.stageName ?? artist.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-wood-900 dark:text-cream-100">
          {artist.stageName ?? artist.name}
        </h3>
        {artist.stageName && (
          <p className="text-sm text-wood-500 dark:text-cream-200/60">{artist.name}</p>
        )}
        <p className="mt-2 line-clamp-3 text-sm text-wood-600 dark:text-cream-200/70">
          {pick(artist, 'biography') as string}
        </p>
        {(pick(artist, 'instrumentUsed') as string) && (
          <p className="mt-3 text-xs font-medium text-copper-500">
            {t('artists.usedInstrument')}: {pick(artist, 'instrumentUsed') as string}
          </p>
        )}
        {socials.length > 0 && (
          <div className="mt-4 flex gap-2">
            {socials.map(({ url, Icon, label }) => (
              <a
                key={label}
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} — ${artist.stageName ?? artist.name}`}
                className="rounded-full border border-wood-500/25 p-2 text-wood-700 transition-colors hover:border-copper-500 hover:text-copper-500 dark:border-copper-400/25 dark:text-cream-200"
              >
                <Icon size={16} aria-hidden />
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
