import { Instagram, Youtube, Music2, Mail } from 'lucide-react';
import type { SiteSettings } from '@/types';

interface SocialLinksProps {
  settings: Pick<SiteSettings, 'instagramUrl' | 'youtubeUrl' | 'spotifyUrl' | 'email'>;
  className?: string;
}

export function SocialLinks({ settings, className = '' }: SocialLinksProps) {
  const links = [
    { url: settings.instagramUrl, Icon: Instagram, label: 'Instagram' },
    { url: settings.youtubeUrl, Icon: Youtube, label: 'YouTube' },
    { url: settings.spotifyUrl, Icon: Music2, label: 'Spotify' },
    { url: settings.email ? `mailto:${settings.email}` : null, Icon: Mail, label: 'Email' },
  ].filter((l) => l.url);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map(({ url, Icon, label }) => (
        <a
          key={label}
          href={url as string}
          target={label === 'Email' ? undefined : '_blank'}
          rel="noopener noreferrer"
          aria-label={label}
          className="rounded-full border border-wood-500/25 p-2 text-wood-700 transition-colors hover:border-copper-500 hover:text-copper-500 dark:border-copper-400/25 dark:text-cream-200"
        >
          <Icon size={18} aria-hidden />
        </a>
      ))}
    </div>
  );
}
