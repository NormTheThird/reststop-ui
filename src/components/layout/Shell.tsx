import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

/** Root layout shell — renders the sidebar alongside the active page. */
export function Shell() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Outlet />
      </div>
    </div>
  );
}
