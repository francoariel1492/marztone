import { SettingsForm, type SettingsField } from '@/components/admin/SettingsForm';
import { AppearanceSettings } from '@/components/admin/AppearanceSettings';

const BRANDING_FIELDS: SettingsField[] = [
  { key: 'siteName', label: 'Nombre del sitio' },
  { key: 'signature', label: 'Firma' },
  { key: 'sloganEs', label: 'Slogan (ES)' },
  { key: 'sloganEn', label: 'Slogan (EN)' },
  { key: 'logoUrl', label: 'Logo (URL)', type: 'url' },
  { key: 'faviconUrl', label: 'Favicon (URL)', type: 'url' },
  { key: 'whatsappNumber', label: 'Número de WhatsApp (solo dígitos)' },
  { key: 'whatsappMessageEs', label: 'Mensaje WhatsApp (ES)', type: 'textarea' },
  { key: 'whatsappMessageEn', label: 'Mensaje WhatsApp (EN)', type: 'textarea' },
];

export function GeneralPage() {
  return (
    <div className="space-y-8">
      <AppearanceSettings />
      <SettingsForm title="Marca y WhatsApp" fields={BRANDING_FIELDS} />
    </div>
  );
}
