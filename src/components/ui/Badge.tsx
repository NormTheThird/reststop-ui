// Badge.tsx
import type { ReactNode } from 'react';

type BadgeVariant = 'green' | 'red' | 'amber' | 'blue' | 'gray';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  green: { background: 'var(--accent2)', color: 'var(--accent-text)' },
  red:   { background: 'var(--danger-bg)', color: 'var(--danger)' },
  amber: { background: 'var(--warning-bg)', color: 'var(--warning)' },
  blue:  { background: 'var(--info-bg)', color: 'var(--info)' },
  gray:  { background: 'var(--surface2)', color: 'var(--text3)' },
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span style={{
      ...variantStyles[variant],
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}
