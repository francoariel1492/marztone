import { api } from './client';
import type {
  Artist,
  Instrument,
  InstrumentCategory,
  PageSection,
  Paginated,
  Service,
  SiteSettings,
  Testimonial,
  WorkshopImage,
} from '@/types';

export const publicApi = {
  getSettings: () => api.get<SiteSettings>('/public/settings').then((r) => r.data),
  getSections: () => api.get<PageSection[]>('/public/sections').then((r) => r.data),
  getWorkshop: () => api.get<WorkshopImage[]>('/public/workshop').then((r) => r.data),
  getCategories: () =>
    api.get<InstrumentCategory[]>('/public/instrument-categories').then((r) => r.data),
  getInstruments: (params?: { category?: string; page?: number; limit?: number }) =>
    api.get<Paginated<Instrument>>('/public/instruments', { params }).then((r) => r.data),
  getInstrument: (slug: string) =>
    api.get<Instrument>(`/public/instruments/${slug}`).then((r) => r.data),
  getArtists: (params?: { page?: number; limit?: number }) =>
    api.get<Paginated<Artist>>('/public/artists', { params }).then((r) => r.data),
  getServices: () => api.get<Service[]>('/public/services').then((r) => r.data),
  getTestimonials: () => api.get<Testimonial[]>('/public/testimonials').then((r) => r.data),
  sendContact: (payload: Record<string, unknown>) =>
    api.post<{ success: boolean }>('/contact', payload).then((r) => r.data),
};
