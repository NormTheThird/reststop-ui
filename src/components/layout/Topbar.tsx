import { useTheme } from '@/context/ThemeContext';

interface TopbarProps {
  title: string;
  actions?: React.ReactNode;
}

export function Topbar({ title, actions }: TopbarProps) {
  const { theme, toggle } = useTheme();

  return (
    <header style={{
      height: 'var(--header-h)',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 12,
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', flex: 1 }}>
        {title}
      </span>

      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {actions}
        </div>
      )}

      <button
        onClick={toggle}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        style={{
          width: 32, height: 32,
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          background: 'var(--surface2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 14, color: 'var(--text2)',
          transition: 'all var(--transition)',
        }}
      >
        {theme === 'light' ? '☽' : '☀'}
      </button>
    </header>
  );
}
