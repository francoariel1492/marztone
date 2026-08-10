import { useTranslation } from 'react-i18next';

type BilingualKeys<T extends string> = `${T}Es` | `${T}En`;

/**
 * Devuelve helpers para elegir el campo correcto (Es/En) de contenido dinámico
 * según el idioma activo de i18n.
 */
export function useLocalizedContent() {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const suffix = isEn ? 'En' : 'Es';

  function pick<T extends string, O extends Record<BilingualKeys<T>, unknown>>(
    obj: O,
    field: T,
  ): O[BilingualKeys<T>] {
    const key = `${field}${suffix}` as BilingualKeys<T>;
    return obj[key];
  }

  return { isEn, lang: isEn ? 'en' : 'es', pick };
}
