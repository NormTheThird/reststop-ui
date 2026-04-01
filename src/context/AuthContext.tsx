import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AuthUser, UserRole } from '@/types/auth';
import * as api from '@/api';

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isInitializing: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Provides authentication state and actions to the component tree. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = sessionStorage.getItem('rs_accessToken');
    const userId = sessionStorage.getItem('rs_userId');
    const role = sessionStorage.getItem('rs_role') as UserRole | null;
    if (token && userId && role) return { accessToken: token, userId, role };
    return null;
  });

  // True only during the initial silent-refresh attempt (no access token but refresh token exists).
  const [isInitializing, setIsInitializing] = useState(
    !sessionStorage.getItem('rs_accessToken') && !!sessionStorage.getItem('rs_refreshToken'),
  );

  useEffect(() => {
    if (!isInitializing) return;
    const storedRefresh = sessionStorage.getItem('rs_refreshToken');
    if (!storedRefresh) { setIsInitializing(false); return; }

    api.refresh(storedRefresh)
      .then((response) => {
        sessionStorage.setItem('rs_accessToken', response.accessToken);
        sessionStorage.setItem('rs_refreshToken', response.refreshToken);
        setUser({ accessToken: response.accessToken, userId: response.userId, role: response.role });
      })
      .catch(() => {
        sessionStorage.removeItem('rs_userId');
        sessionStorage.removeItem('rs_role');
        sessionStorage.removeItem('rs_refreshToken');
      })
      .finally(() => setIsInitializing(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.login({ email, password });

    if (!['Admin', 'SuperAdmin', 'Moderator'].includes(response.role)) {
      throw new Error('Access denied. Admin role required.');
    }

    sessionStorage.setItem('rs_accessToken', response.accessToken);
    sessionStorage.setItem('rs_userId', response.userId);
    sessionStorage.setItem('rs_role', response.role);
    sessionStorage.setItem('rs_refreshToken', response.refreshToken);

    setUser({
      accessToken: response.accessToken,
      userId: response.userId,
      role: response.role,
    });
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = sessionStorage.getItem('rs_refreshToken');
    if (refreshToken) {
      try { await api.logout(refreshToken); } catch { /* silent */ }
    }
    sessionStorage.removeItem('rs_accessToken');
    sessionStorage.removeItem('rs_userId');
    sessionStorage.removeItem('rs_role');
    sessionStorage.removeItem('rs_refreshToken');
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles: UserRole[]) => !!user && roles.includes(user.role),
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, isInitializing, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Returns the auth context. Must be used within an AuthProvider. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
