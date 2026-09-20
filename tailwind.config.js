/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand neutrals — restrained, premium
        brand: {
          50:  '#f7f7f6',
          100: '#edecea',
          200: '#dbd9d5',
          300: '#c2bfb9',
          400: '#a8a49c',
          500: '#8f8a80',
          600: '#75706a',
          700: '#605c57',
          800: '#504d49',
          900: '#1a1a18',
          950: '#0d0d0c',
        },
        // Accent — warm copper/terracotta
        accent: {
          50:  '#fdf5f0',
          100: '#fae8db',
          200: '#f4cdb5',
          300: '#edab85',
          400: '#e48552',
          500: '#dd6a2f',
          600: '#cf5424',
          700: '#ac401e',
          800: '#8a351f',
          900: '#712e1c',
          950: '#3d150c',
        },
        // Surface layers
        surface: {
          0:   '#ffffff',
          50:  '#fafaf9',
          100: '#f5f4f2',
          200: '#eeedeb',
          300: '#e4e2df',
          400: '#d6d4d0',
        },
        // Semantic
        success: { DEFAULT: '#2d7a4f', light: '#eaf5ef', dark: '#1a5c36' },
        warning: { DEFAULT: '#b45309', light: '#fef3cd', dark: '#854d0e' },
        error:   { DEFAULT: '#c53030', light: '#fde8e8', dark: '#9b2c2c' },
        info:    { DEFAULT: '#2563eb', light: '#eff6ff', dark: '#1d4ed8' },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        '2xs':  ['0.6875rem', { lineHeight: '1rem' }],
        'xs':   ['0.75rem',   { lineHeight: '1rem' }],
        'sm':   ['0.8125rem', { lineHeight: '1.25rem' }],
        'base': ['0.9375rem', { lineHeight: '1.5rem' }],
        'lg':   ['1.0625rem', { lineHeight: '1.625rem' }],
        'xl':   ['1.25rem',   { lineHeight: '1.75rem' }],
        '2xl':  ['1.5rem',    { lineHeight: '2rem' }],
        '3xl':  ['1.875rem',  { lineHeight: '2.25rem' }],
        '4xl':  ['2.25rem',   { lineHeight: '2.75rem' }],
        '5xl':  ['3rem',      { lineHeight: '3.5rem' }],
      },

      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
        '26':  '6.5rem',
        '30':  '7.5rem',
        '34':  '8.5rem',
        '38':  '9.5rem',
        '42':  '10.5rem',
        '50':  '12.5rem',
        '68':  '17rem',
        '84':  '21rem',
        '100': '25rem',
        '120': '30rem',
      },

      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      boxShadow: {
        'xs':   '0 1px 2px rgba(0,0,0,0.04)',
        'sm':   '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'md':   '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)',
        'lg':   '0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -4px rgba(0,0,0,0.04)',
        'xl':   '0 20px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.04)',
        '2xl':  '0 25px 50px -12px rgba(0,0,0,0.12)',
        'inner': 'inset 0 2px 4px rgba(0,0,0,0.04)',
        'card':  '0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        'elevated': '0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)',
      },

      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '350': '350ms',
        '500': '500ms',
      },

      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      backdropBlur: {
        xs: '2px',
      },

      screens: {
        'xs': '480px',
      },

      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },

      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'spinner': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      animation: {
        'fade-in':     'fade-in 200ms ease-out',
        'slide-up':    'slide-up 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down':  'slide-down 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':    'scale-in 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'spinner':     'spinner 0.6s linear infinite',
        'shimmer':     'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
}
