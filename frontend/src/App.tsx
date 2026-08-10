import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/store/theme';
import { AuthProvider } from '@/features/auth/AuthContext';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { LandingPage } from '@/pages/public/LandingPage';
import { LoadingSpinner } from '@/components/common/States';

// Carga diferida del panel de administración (code splitting)
const AdminLayout = lazy(() =>
  import('@/components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })),
);
const LoginPage = lazy(() =>
  import('@/pages/admin/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const DashboardPage = lazy(() =>
  import('@/pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const GeneralPage = lazy(() =>
  import('@/pages/admin/GeneralPage').then((m) => ({ default: m.GeneralPage })),
);
const SectionsPage = lazy(() =>
  import('@/pages/admin/SectionsPage').then((m) => ({ default: m.SectionsPage })),
);
const WorkshopPage = lazy(() =>
  import('@/pages/admin/WorkshopPage').then((m) => ({ default: m.WorkshopPage })),
);
const InstrumentsPage = lazy(() =>
  import('@/pages/admin/InstrumentsPage').then((m) => ({ default: m.InstrumentsPage })),
);
const ArtistsPage = lazy(() =>
  import('@/pages/admin/ArtistsPage').then((m) => ({ default: m.ArtistsPage })),
);
const ServicesPage = lazy(() =>
  import('@/pages/admin/ServicesPage').then((m) => ({ default: m.ServicesPage })),
);
const TestimonialsPage = lazy(() =>
  import('@/pages/admin/TestimonialsPage').then((m) => ({ default: m.TestimonialsPage })),
);
const MessagesPage = lazy(() =>
  import('@/pages/admin/MessagesPage').then((m) => ({ default: m.MessagesPage })),
);
const MediaPage = lazy(() =>
  import('@/pages/admin/MediaPage').then((m) => ({ default: m.MediaPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/admin/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 1000 * 60 },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense
              fallback={
                <div className="flex min-h-screen items-center justify-center bg-cream-100 dark:bg-charcoal-950">
                  <LoadingSpinner />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/admin/login" element={<LoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="general" element={<GeneralPage />} />
                  <Route path="sections" element={<SectionsPage />} />
                  <Route path="workshop" element={<WorkshopPage />} />
                  <Route path="instruments" element={<InstrumentsPage />} />
                  <Route path="artists" element={<ArtistsPage />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="testimonials" element={<TestimonialsPage />} />
                  <Route path="messages" element={<MessagesPage />} />
                  <Route path="media" element={<MediaPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
