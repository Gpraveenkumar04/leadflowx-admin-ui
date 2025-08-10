// Design tokens (extend or map to Tailwind config)
export const colors = {
  primary: {
    DEFAULT: 'var(--color-primary-600)',
    50: 'var(--color-primary-50)',
    100: 'var(--color-primary-100)',
    200: 'var(--color-primary-200)',
    300: 'var(--color-primary-300)',
    400: 'var(--color-primary-400)',
    500: 'var(--color-primary-500)',
    600: 'var(--color-primary-600)',
    700: 'var(--color-primary-700)',
    800: 'var(--color-primary-800)',
    900: 'var(--color-primary-900)'
  },
  success: 'var(--color-success-500)',
  warning: 'var(--color-warning-500)',
  danger: 'var(--color-danger-500)',
  neutral: '#6b7280'
};

export const radii = {
  xs: '2px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  full: '9999px'
};

export const shadows = {
  soft: '0 2px 15px 0 rgba(0,0,0,0.08)',
  medium: '0 4px 25px 0 rgba(0,0,0,0.12)',
  hard: '0 10px 40px 0 rgba(0,0,0,0.16)'
};

export const spacing = {
  0: '0px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px'
};

export const font = {
  size: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    md: '1.0625rem',
    lg: '1.125rem',
    xl: '1.25rem'
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
};

export const transitions = {
  fast: '120ms ease',
  base: '180ms ease',
  slow: '240ms ease'
};
