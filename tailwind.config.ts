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
      colors: {
        brand: {
          blue: '#2E7FE8',
          green: '#22c55e'
        }
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
