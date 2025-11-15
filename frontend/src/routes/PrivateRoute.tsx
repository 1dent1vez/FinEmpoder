import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/auth';

export function PrivateRoute() {
  const hasHydrated = useAuth.persist.hasHydrated();
  const token = useAuth((s) => s.token);

  if (!hasHydrated) return null; // evita redirecciones antes de rehidratar

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
