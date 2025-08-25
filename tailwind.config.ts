import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Noto Sans JP', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: '#2E7FE8',
          green: '#22c55e'
        }
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 1px -1px rgb(0 0 0 / 0.03)',
        md: '0 4px 12px -2px rgb(0 0 0 / 0.06), 0 2px 6px -2px rgb(0 0 0 / 0.04)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.96)' },
          '50%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        pop: 'pop 300ms ease-out',
      },
    },
  },
  plugins: [],
};
export default config;
