/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta artesanal MarzTone (madera, cobre, crema)
        cream: {
          50: '#faf6ef',
          100: '#f4ede1',
          200: '#e9dcc9',
          300: '#dcc7aa',
        },
        wood: {
          400: '#b08a5e',
          500: '#8a5a2b',
          600: '#6f4620',
          700: '#5b4636',
          800: '#3d2a1d',
          900: '#2b1d16',
          950: '#1a110c',
        },
        copper: {
          400: 'rgb(var(--accent-400) / <alpha-value>)',
          500: 'rgb(var(--accent-500) / <alpha-value>)',
          600: 'rgb(var(--accent-600) / <alpha-value>)',
        },
        gold: {
          400: 'rgb(var(--accent-400) / <alpha-value>)',
          500: 'rgb(var(--accent-500) / <alpha-value>)',
        },
        charcoal: {
          800: '#241a14',
          900: '#171009',
          950: '#0f0a06',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', '"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(43, 29, 22, 0.25)',
        warm: '0 8px 30px -8px rgba(138, 90, 43, 0.35)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
