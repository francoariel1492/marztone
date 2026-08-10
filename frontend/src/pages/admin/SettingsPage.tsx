import { SettingsForm, type SettingsField } from '@/components/admin/SettingsForm';

const CONTACT_FIELDS: SettingsField[] = [
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Teléfono' },
  { key: 'addressEs', label: 'Dirección (ES)' },
  { key: 'addressEn', label: 'Dirección (EN)' },
  { key: 'openingHoursEs', label: 'Horarios (ES)' },
  { key: 'openingHoursEn', label: 'Horarios (EN)' },
  { key: 'mapEmbedUrl', label: 'Google Maps embed (URL)', type: 'url' },
  { key: 'instagramUrl', label: 'Instagram', type: 'url' },
  { key: 'youtubeUrl', label: 'YouTube', type: 'url' },
  { key: 'spotifyUrl', label: 'Spotify', type: 'url' },
];

const SEO_FIELDS: SettingsField[] = [
  { key: 'seoTitleEs', label: 'Título SEO (ES)' },
  { key: 'seoTitleEn', label: 'Título SEO (EN)' },
  { key: 'seoDescriptionEs', label: 'Descripción SEO (ES)', type: 'textarea' },
  { key: 'seoDescriptionEn', label: 'Descripción SEO (EN)', type: 'textarea' },
  { key: 'ogImageUrl', label: 'Open Graph image (URL)', type: 'url' },
];

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <SettingsForm title="Contacto y redes" fields={CONTACT_FIELDS} />
      <SettingsForm title="SEO y Open Graph" fields={SEO_FIELDS} />
    </div>
  );
}
