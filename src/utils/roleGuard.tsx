import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types/auth';

interface RequireRoleProps {
  roles: UserRole[];
  children: React.ReactNode;
}

/**
 * Wraps a route and redirects to /login if the user is not authenticated,
 * or to /unauthorised if they lack the required role.
 * Waits for the silent token-refresh on startup before deciding.
 */
export function RequireRole({ roles, children }: RequireRoleProps) {
  const { isAuthenticated, isInitializing, hasRole } = useAuth();

  if (isInitializing) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasRole(...roles)) return <Navigate to="/unauthorised" replace />;

  return <>{children}</>;
}
