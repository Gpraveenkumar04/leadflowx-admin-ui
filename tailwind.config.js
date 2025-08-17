const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        gray: colors.slate,
        success: colors.emerald,
        warning: colors.amber,
        danger: colors.red,
        info: colors.sky,
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          hover: 'rgb(var(--surface-hover) / <alpha-value>)',
          muted: 'rgb(var(--surface-muted) / <alpha-value>)',
        },
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          hover: 'rgb(var(--brand-hover) / <alpha-value>)',
          muted: 'rgb(var(--brand-muted) / <alpha-value>)',
          contrast: 'rgb(var(--brand-contrast) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'hover-card': 'hoverCard 0.3s ease forwards',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(10px)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        hoverCard: {
          '0%': { transform: 'translateY(0) rotate(0)' },
          '100%': { transform: 'translateY(-5px) rotate(1deg)' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
      boxShadow: {
        'xs': '0 1px 2px rgb(16 24 40 / 0.05)',
        'sm': '0 2px 4px rgb(16 24 40 / 0.06), 0 1px 2px rgb(16 24 40 / 0.04)',
        'md': '0 4px 8px -2px rgb(16 24 40 / 0.1), 0 2px 4px -2px rgb(16 24 40 / 0.06)',
        'lg': '0 12px 16px -4px rgb(16 24 40 / 0.08), 0 4px 6px -2px rgb(16 24 40 / 0.03)',
        'xl': '0 20px 24px -4px rgb(16 24 40 / 0.08), 0 8px 8px -4px rgb(16 24 40 / 0.03)',
        '2xl': '0 24px 48px -12px rgb(16 24 40 / 0.18)',
        '3xl': '0 32px 64px -12px rgb(16 24 40 / 0.14)',
        'glass': '0 0 15px 0 rgb(0 0 0 / 0.05)',
        'glass-lg': '0 0 30px 0 rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    // Custom utilities plugin
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
        '.backdrop-blur-2': {
          '--tw-backdrop-blur': 'blur(2px)',
          '-webkit-backdrop-filter': 'var(--tw-backdrop-blur)',
          'backdrop-filter': 'var(--tw-backdrop-blur)',
        },
        '.backdrop-blur-4': {
          '--tw-backdrop-blur': 'blur(4px)',
          '-webkit-backdrop-filter': 'var(--tw-backdrop-blur)',
          'backdrop-filter': 'var(--tw-backdrop-blur)',
        },
        '.backdrop-blur-6': {
          '--tw-backdrop-blur': 'blur(6px)',
          '-webkit-backdrop-filter': 'var(--tw-backdrop-blur)',
          'backdrop-filter': 'var(--tw-backdrop-blur)',
        },
      };

      addUtilities(newUtilities);
    },
  ],
}
