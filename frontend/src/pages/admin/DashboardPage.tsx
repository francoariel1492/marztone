import { useQuery } from '@tanstack/react-query';
import { Guitar, Users, Wrench, Mail, MailWarning, Eye, EyeOff } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { LoadingSpinner, ErrorState } from '@/components/common/States';

export function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminApi.getDashboard,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorState />;

  const { counts, latestMessages } = data;
  const cards = [
    { label: 'Instrumentos', value: counts.instruments, Icon: Guitar },
    { label: 'Artistas', value: counts.artists, Icon: Users },
    { label: 'Servicios', value: counts.services, Icon: Wrench },
    { label: 'Mensajes', value: counts.messages, Icon: Mail },
    { label: 'Sin leer', value: counts.unreadMessages, Icon: MailWarning },
    { label: 'Publicados', value: counts.publishedInstruments, Icon: Eye },
    { label: 'Ocultos', value: counts.hiddenInstruments, Icon: EyeOff },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, Icon }) => (
          <div key={label} className="card flex items-center gap-4 p-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-wood-800/10 text-copper-500 dark:bg-copper-400/10">
              <Icon size={22} aria-hidden />
            </span>
            <div>
              <p className="text-2xl font-bold text-wood-900 dark:text-cream-100">{value}</p>
              <p className="text-sm text-wood-500 dark:text-cream-200/60">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold text-wood-900 dark:text-cream-100">
          Últimos mensajes
        </h2>
        {latestMessages.length ? (
          <ul className="divide-y divide-wood-500/10 dark:divide-copper-400/10">
            {latestMessages.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-wood-900 dark:text-cream-100">{m.name}</p>
                  <p className="text-sm text-wood-500 dark:text-cream-200/60">{m.subject}</p>
                </div>
                {!m.isRead && (
                  <span className="rounded-full bg-copper-500/15 px-2 py-0.5 text-xs font-semibold text-copper-600">
                    Nuevo
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-wood-500 dark:text-cream-200/60">No hay mensajes todavía.</p>
        )}
      </div>
    </div>
  );
}
