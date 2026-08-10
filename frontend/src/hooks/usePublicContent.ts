import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/api/public';

export const useSettings = () =>
  useQuery({ queryKey: ['settings'], queryFn: publicApi.getSettings, staleTime: 1000 * 60 * 5 });

export const useSections = () =>
  useQuery({ queryKey: ['sections'], queryFn: publicApi.getSections, staleTime: 1000 * 60 * 5 });

export const useWorkshop = () =>
  useQuery({ queryKey: ['workshop'], queryFn: publicApi.getWorkshop });

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: publicApi.getCategories });

export const useInstruments = (category?: string) =>
  useQuery({
    queryKey: ['instruments', category ?? 'all'],
    queryFn: () => publicApi.getInstruments({ category, limit: 50 }),
  });

export const useArtists = () =>
  useQuery({ queryKey: ['artists'], queryFn: () => publicApi.getArtists({ limit: 50 }) });

export const useServices = () =>
  useQuery({ queryKey: ['services'], queryFn: publicApi.getServices });

export const useTestimonials = () =>
  useQuery({ queryKey: ['testimonials'], queryFn: publicApi.getTestimonials });
