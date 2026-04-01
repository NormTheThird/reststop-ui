import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  badge?: number;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Overview', icon: '▦' },
  { to: '/locations', label: 'Locations', icon: '◎' },
  { to: '/reviews', label: 'Reviews', icon: '◻' },
  { to: '/users', label: 'Users', icon: '◈', roles: ['Admin', 'SuperAdmin'] },
  { to: '/partners', label: 'Partners', icon: '◆', roles: ['Admin', 'SuperAdmin'] },
  { to: '/flagged', label: 'Flagged', icon: '⚑' },
];

export function Sidebar() {
  const { user, logout, hasRole } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || hasRole(...(item.roles as never[]))
  );

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 28, height: 28, background: 'var(--accent)',
            borderRadius: 6, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 14, color: '#fff',
          }}>
            ◎
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>
            RestStop
          </span>
          <span style={{
            fontSize: 9, background: 'var(--accent2)', color: 'var(--accent-text)',
            padding: '2px 6px', borderRadius: 20, fontWeight: 500,
          }}>
            Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 6px', overflowY: 'auto' }}>
        <div style={{
          fontSize: 10, fontWeight: 500, color: 'var(--text3)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '8px 10px 4px',
        }}>
          Menu
        </div>

        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '7px 10px',
              borderRadius: 'var(--radius)',
              fontSize: 13,
              color: isActive ? 'var(--accent-text)' : 'var(--text2)',
              background: isActive ? 'var(--accent2)' : 'transparent',
              fontWeight: isActive ? 500 : 400,
              marginBottom: 1,
              transition: 'all var(--transition)',
              textDecoration: 'none',
            })}
          >
            <span style={{ fontSize: 13, opacity: 0.8 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge ? (
              <span style={{
                background: 'var(--danger)', color: '#fff',
                fontSize: 10, padding: '1px 6px', borderRadius: 20, fontWeight: 600,
              }}>
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      {/* User row */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'var(--accent2)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, color: 'var(--accent-text)', flexShrink: 0,
          }}>
            {user?.role.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.role}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)' }}>Signed in</div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text3)', padding: 4, fontSize: 14,
              transition: 'color var(--transition)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text3)')}
          >
            ⇥
          </button>
        </div>
      </div>
    </aside>
  );
}
