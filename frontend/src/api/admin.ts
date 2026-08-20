import { api } from './client';
import type {
  Artist,
  DashboardStats,
  Instrument,
  MediaFile,
  PageSection,
  Paginated,
  Service,
  SiteSettings,
  Testimonial,
  ContactMessage,
  WorkshopImage,
  InstrumentCategory,
} from '@/types';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const adminApi = {
  getDashboard: () => api.get<DashboardStats>('/admin/dashboard').then((r) => r.data),

  // Settings
  getSettings: () => api.get<SiteSettings>('/admin/settings').then((r) => r.data),
  updateSettings: (data: Partial<SiteSettings>) =>
    api.patch<SiteSettings>('/admin/settings', data).then((r) => r.data),

  // Sections
  getSections: () => api.get<PageSection[]>('/admin/sections').then((r) => r.data),
  createSection: (data: Partial<PageSection>) =>
    api.post<PageSection>('/admin/sections', data).then((r) => r.data),
  updateSection: (id: string, data: Partial<PageSection>) =>
    api.patch<PageSection>(`/admin/sections/${id}`, data).then((r) => r.data),
  deleteSection: (id: string) => api.delete(`/admin/sections/${id}`).then((r) => r.data),

  // Workshop
  getWorkshop: () => api.get<WorkshopImage[]>('/admin/workshop').then((r) => r.data),
  createWorkshop: (data: Partial<WorkshopImage>) =>
    api.post<WorkshopImage>('/admin/workshop', data).then((r) => r.data),
  updateWorkshop: (id: string, data: Partial<WorkshopImage>) =>
    api.patch<WorkshopImage>(`/admin/workshop/${id}`, data).then((r) => r.data),
  deleteWorkshop: (id: string) => api.delete(`/admin/workshop/${id}`).then((r) => r.data),

  // Categories
  getCategories: () =>
    api.get<InstrumentCategory[]>('/admin/instrument-categories').then((r) => r.data),
  createCategory: (data: Partial<InstrumentCategory>) =>
    api.post('/admin/instrument-categories', data).then((r) => r.data),
  updateCategory: (id: string, data: Partial<InstrumentCategory>) =>
    api.patch(`/admin/instrument-categories/${id}`, data).then((r) => r.data),
  deleteCategory: (id: string) =>
    api.delete(`/admin/instrument-categories/${id}`).then((r) => r.data),

  // Instruments
  getInstruments: (params?: ListParams) =>
    api.get<Paginated<Instrument>>('/admin/instruments', { params }).then((r) => r.data),
  getInstrument: (id: string) =>
    api.get<Instrument>(`/admin/instruments/${id}`).then((r) => r.data),
  createInstrument: (data: Record<string, unknown>) =>
    api.post<Instrument>('/admin/instruments', data).then((r) => r.data),
  updateInstrument: (id: string, data: Record<string, unknown>) =>
    api.patch<Instrument>(`/admin/instruments/${id}`, data).then((r) => r.data),
  deleteInstrument: (id: string) => api.delete(`/admin/instruments/${id}`).then((r) => r.data),

  // Artists
  getArtists: (params?: ListParams) =>
    api.get<Paginated<Artist>>('/admin/artists', { params }).then((r) => r.data),
  createArtist: (data: Record<string, unknown>) =>
    api.post<Artist>('/admin/artists', data).then((r) => r.data),
  updateArtist: (id: string, data: Record<string, unknown>) =>
    api.patch<Artist>(`/admin/artists/${id}`, data).then((r) => r.data),
  deleteArtist: (id: string) => api.delete(`/admin/artists/${id}`).then((r) => r.data),

  // Services
  getServices: () => api.get<Service[]>('/admin/services').then((r) => r.data),
  createService: (data: Record<string, unknown>) =>
    api.post<Service>('/admin/services', data).then((r) => r.data),
  updateService: (id: string, data: Record<string, unknown>) =>
    api.patch<Service>(`/admin/services/${id}`, data).then((r) => r.data),
  deleteService: (id: string) => api.delete(`/admin/services/${id}`).then((r) => r.data),

  // Testimonials
  getTestimonials: () => api.get<Testimonial[]>('/admin/testimonials').then((r) => r.data),
  createTestimonial: (data: Record<string, unknown>) =>
    api.post<Testimonial>('/admin/testimonials', data).then((r) => r.data),
  updateTestimonial: (id: string, data: Record<string, unknown>) =>
    api.patch<Testimonial>(`/admin/testimonials/${id}`, data).then((r) => r.data),
  deleteTestimonial: (id: string) => api.delete(`/admin/testimonials/${id}`).then((r) => r.data),

  // Messages
  getMessages: (params?: ListParams) =>
    api.get<Paginated<ContactMessage>>('/admin/messages', { params }).then((r) => r.data),
  markMessageRead: (id: string) =>
    api.patch<ContactMessage>(`/admin/messages/${id}/read`).then((r) => r.data),
  deleteMessage: (id: string) => api.delete(`/admin/messages/${id}`).then((r) => r.data),

  // Media
  getMedia: (params?: ListParams) =>
    api.get<Paginated<MediaFile>>('/admin/media', { params }).then((r) => r.data),
  uploadMedia: (file: File, altEs?: string, altEn?: string) => {
    const form = new FormData();
    form.append('file', file);
    if (altEs) form.append('altEs', altEs);
    if (altEn) form.append('altEn', altEn);
    return api
      .post<MediaFile>('/admin/media', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },
  deleteMedia: (id: string) => api.delete(`/admin/media/${id}`).then((r) => r.data),
};
