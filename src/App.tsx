import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { RequireRole } from '@/utils/roleGuard';
import { Shell } from '@/components/layout/Shell';
import Login from '@/pages/Login';
import Overview from '@/pages/Overview';
import Locations from '@/pages/Locations';
import Reviews from '@/pages/Reviews';
import Users from '@/pages/Users';
import { Partners, FlaggedContent } from '@/pages/Partners';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                element={
                  <RequireRole roles={['Admin', 'SuperAdmin', 'Moderator']}>
                    <Shell />
                  </RequireRole>
                }
              >
                <Route path="/" element={<Overview />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route
                  path="/users"
                  element={
                    <RequireRole roles={['Admin', 'SuperAdmin']}>
                      <Users />
                    </RequireRole>
                  }
                />
                <Route
                  path="/partners"
                  element={
                    <RequireRole roles={['Admin', 'SuperAdmin']}>
                      <Partners />
                    </RequireRole>
                  }
                />
                <Route path="/flagged" element={<FlaggedContent />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
