export type InstrumentStatus = 'AVAILABLE' | 'SOLD' | 'MADE_TO_ORDER';
export type Language = 'ES' | 'EN';

export interface SiteSettings {
  id: string;
  siteName: string;
  signature: string;
  sloganEs: string;
  sloganEn: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  email: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessageEs: string;
  whatsappMessageEn: string;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  spotifyUrl: string | null;
  addressEs: string;
  addressEn: string;
  openingHoursEs: string;
  openingHoursEn: string;
  mapEmbedUrl: string | null;
  seoTitleEs: string;
  seoTitleEn: string;
  seoDescriptionEs: string;
  seoDescriptionEn: string;
  ogImageUrl: string | null;
  fontHeading: string;
  fontBody: string;
  colorTheme: string;
}

export type SectionLayout =
  | 'imagen-derecha'
  | 'imagen-izquierda'
  | 'texto-centrado'
  | 'imagen-fondo'
  | 'apilado'
  | 'banda-color';

export interface PageSection {
  id: string;
  key: string;
  label: string;
  layout: SectionLayout;
  titleEs: string;
  titleEn: string;
  subtitleEs: string | null;
  subtitleEn: string | null;
  contentEs: string | null;
  contentEn: string | null;
  imageUrl: string | null;
  isVisible: boolean;
  displayOrder: number;
}

export interface WorkshopImage {
  id: string;
  titleEs: string | null;
  titleEn: string | null;
  descriptionEs: string | null;
  descriptionEn: string | null;
  imageUrl: string;
  altEs: string;
  altEn: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface InstrumentCategory {
  id: string;
  slug: string;
  nameEs: string;
  nameEn: string;
  displayOrder: number;
  isActive: boolean;
}

export interface InstrumentImage {
  id: string;
  imageUrl: string;
  altEs: string;
  altEn: string;
  displayOrder: number;
}

export interface Instrument {
  id: string;
  slug: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  materialsEs: string | null;
  materialsEn: string | null;
  specificationsEs: string | null;
  specificationsEn: string | null;
  status: InstrumentStatus;
  price: string | null;
  currency: string | null;
  mainImageUrl: string;
  youtubeUrl: string | null;
  whatsappMessageEs: string | null;
  whatsappMessageEn: string | null;
  categoryId: string;
  category: InstrumentCategory;
  images: InstrumentImage[];
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
}

export interface Artist {
  id: string;
  slug: string;
  name: string;
  stageName: string | null;
  biographyEs: string;
  biographyEn: string;
  instrumentUsedEs: string | null;
  instrumentUsedEn: string | null;
  imageUrl: string;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  spotifyUrl: string | null;
  websiteUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
}

export interface Service {
  id: string;
  slug: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  icon: string | null;
  imageUrl: string | null;
  whatsappMessageEs: string | null;
  whatsappMessageEn: string | null;
  isActive: boolean;
  displayOrder: number;
}

export interface Testimonial {
  id: string;
  customerName: string;
  customerImageUrl: string | null;
  relatedWorkEs: string | null;
  relatedWorkEn: string | null;
  commentEs: string;
  commentEn: string;
  artistUrl: string | null;
  isPublished: boolean;
  displayOrder: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  inquiryType: string;
  subject: string;
  message: string;
  language: Language;
  isRead: boolean;
  createdAt: string;
}

export interface MediaFile {
  id: string;
  url: string;
  storageKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  altEs: string | null;
  altEn: string | null;
  createdAt: string;
}

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface DashboardStats {
  counts: {
    instruments: number;
    publishedInstruments: number;
    hiddenInstruments: number;
    artists: number;
    services: number;
    messages: number;
    unreadMessages: number;
  };
  latestMessages: Pick<ContactMessage, 'id' | 'name' | 'email' | 'subject' | 'isRead'>[] & {
    createdAt: string;
  }[];
}
