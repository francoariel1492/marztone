import {
  LayoutDashboard,
  Settings,
  LayoutTemplate,
  Hammer,
  Guitar,
  Users,
  Wrench,
  Quote,
  Mail,
  Image,
} from 'lucide-react';

export interface AdminNavItem {
  to: string;
  label: string;
  Icon: typeof LayoutDashboard;
  end?: boolean;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/general', label: 'General', Icon: Settings },
  { to: '/admin/sections', label: 'Secciones', Icon: LayoutTemplate },
  { to: '/admin/workshop', label: 'El taller', Icon: Hammer },
  { to: '/admin/instruments', label: 'Instrumentos', Icon: Guitar },
  { to: '/admin/artists', label: 'Artistas', Icon: Users },
  { to: '/admin/services', label: 'Servicios', Icon: Wrench },
  { to: '/admin/testimonials', label: 'Testimonios', Icon: Quote },
  { to: '/admin/messages', label: 'Mensajes', Icon: Mail },
  { to: '/admin/media', label: 'Multimedia', Icon: Image },
  { to: '/admin/settings', label: 'Configuración', Icon: Settings },
];
