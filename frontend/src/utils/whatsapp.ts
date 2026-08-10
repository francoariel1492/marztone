import type { SiteSettings } from '@/types';

/** Construye una URL de WhatsApp segura a partir del número y mensaje. */
export function buildWhatsAppUrl(number: string, message: string): string {
  const digits = number.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function whatsappFromSettings(
  settings: Pick<SiteSettings, 'whatsappNumber' | 'whatsappMessageEs' | 'whatsappMessageEn'>,
  isEn: boolean,
  customMessage?: string | null,
): string {
  const message =
    customMessage ?? (isEn ? settings.whatsappMessageEn : settings.whatsappMessageEs);
  return buildWhatsAppUrl(settings.whatsappNumber, message);
}
