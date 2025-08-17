// Modern Design System Tokens
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
  success: {
    light: 'var(--color-success-100)',
    DEFAULT: 'var(--color-success-500)',
    dark: 'var(--color-success-700)'
  },
  warning: {
    light: 'var(--color-warning-100)',
    DEFAULT: 'var(--color-warning-500)',
    dark: 'var(--color-warning-700)'
  },
  danger: {
    light: 'var(--color-danger-100)',
    DEFAULT: 'var(--color-danger-500)',
    dark: 'var(--color-danger-700)'
  },
  info: {
    light: 'var(--color-info-100)',
    DEFAULT: 'var(--color-info-500)',
    dark: 'var(--color-info-700)'
  },
  neutral: {
    50: 'var(--color-neutral-50)',
    100: 'var(--color-neutral-100)',
    200: 'var(--color-neutral-200)',
    300: 'var(--color-neutral-300)',
    400: 'var(--color-neutral-400)',
    500: 'var(--color-neutral-500)',
    600: 'var(--color-neutral-600)',
    700: 'var(--color-neutral-700)',
    800: 'var(--color-neutral-800)',
    900: 'var(--color-neutral-900)'
  }
};

export const radii = {
  xs: '2px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  full: '9999px'
};

export const shadows = {
  xs: '0 1px 2px rgba(16, 24, 40, 0.05)',
  sm: '0 2px 4px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)',
  md: '0 4px 8px -2px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.06)',
  lg: '0 12px 16px -4px rgba(16, 24, 40, 0.08), 0 4px 6px -2px rgba(16, 24, 40, 0.03)',
  xl: '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)',
  '2xl': '0 24px 48px -12px rgba(16, 24, 40, 0.18)',
  '3xl': '0 32px 64px -12px rgba(16, 24, 40, 0.14)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  focus: '0 0 0 4px rgba(47, 133, 90, 0.15)',
  'focus-error': '0 0 0 4px rgba(225, 29, 72, 0.15)'
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
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px'
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
