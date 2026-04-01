import type { ReactNode } from 'react';

// ── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

export function Card({ children, style }: CardProps) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  actions?: ReactNode;
}

export function CardHeader({ title, actions }: CardHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 20px',
      borderBottom: '1px solid var(--border)',
      gap: 12,
    }}>
      <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{title}</span>
      {actions}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ label, value, sub, trend }: StatCardProps) {
  const trendColor =
    trend === 'up' ? 'var(--accent)' :
    trend === 'down' ? 'var(--danger)' :
    'var(--text3)';

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.03em', marginBottom: 4 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: trendColor }}>
          {sub}
        </div>
      )}
    </div>
  );
}
