import { useEffect } from 'react';
import type { SiteSettings } from '@/types';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';

function setMeta(attr: 'name' | 'property', key: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/** Actualiza title, meta description, Open Graph y JSON-LD según idioma y settings. */
export function useSeo(settings?: SiteSettings): void {
  const { isEn } = useLocalizedContent();

  useEffect(() => {
    if (!settings) return;
    const title = isEn ? settings.seoTitleEn : settings.seoTitleEs;
    const description = isEn ? settings.seoDescriptionEn : settings.seoDescriptionEs;

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    if (settings.ogImageUrl) setMeta('property', 'og:image', settings.ogImageUrl);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    // JSON-LD LocalBusiness
    const ldId = 'marztone-jsonld';
    let script = document.getElementById(ldId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = ldId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'MarzTone',
      founder: 'Manuel Robles Urquiza',
      description,
      email: settings.email,
      telephone: settings.phone,
      address: isEn ? settings.addressEn : settings.addressEs,
      image: settings.ogImageUrl ?? undefined,
      sameAs: [settings.instagramUrl, settings.youtubeUrl, settings.spotifyUrl].filter(Boolean),
    });
  }, [settings, isEn]);
}
