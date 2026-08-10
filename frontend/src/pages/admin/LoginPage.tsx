import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Wordmark } from '@/components/common/Wordmark';
import { ThemeSelector } from '@/components/common/ThemeSelector';
import { useAuth } from '@/features/auth/AuthContext';

export function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/admin';

  if (!isLoading && user) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      setError('Credenciales inválidas o cuenta bloqueada.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-4 dark:bg-charcoal-950">
      <div className="absolute right-4 top-4">
        <ThemeSelector />
      </div>
      <div className="card w-full max-w-md p-8">
        <div className="mb-8 flex justify-center">
          <Wordmark size="md" />
        </div>
        <h1 className="mb-6 text-center text-xl font-semibold text-wood-900 dark:text-cream-100">
          Panel de administración
        </h1>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <p className="flex items-center gap-2 text-sm text-red-600" role="alert">
              <AlertCircle size={16} /> {error}
            </p>
          )}
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
