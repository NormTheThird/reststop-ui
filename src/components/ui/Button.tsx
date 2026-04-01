import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const base: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: 'inherit',
  fontWeight: 500,
  borderRadius: 'var(--radius)',
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'opacity 0.15s, background 0.15s',
  whiteSpace: 'nowrap',
};

const variants: Record<ButtonVariant, React.CSSProperties> = {
  primary:   { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' },
  secondary: { background: 'var(--surface2)', color: 'var(--text)', borderColor: 'var(--border)' },
  danger:    { background: 'var(--danger-bg)', color: 'var(--danger)', borderColor: 'var(--danger)' },
  ghost:     { background: 'transparent', color: 'var(--text2)', borderColor: 'transparent' },
};

const sizes: Record<ButtonSize, React.CSSProperties> = {
  sm: { fontSize: 12, padding: '4px 10px' },
  md: { fontSize: 13, padding: '7px 14px' },
};

export function Button({
  variant = 'secondary',
  size = 'md',
  style,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      style={{ ...base, ...variants[variant], ...sizes[size], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
