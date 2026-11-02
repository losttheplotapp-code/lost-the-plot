/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cinema: {
          50: '#f8f9fb',
          100: '#eef1f6',
          200: '#d4d9e3',
          300: '#a8b1c5',
          400: '#7a8399',
          500: '#545d72',
          600: '#3d4458',
          700: '#2a3045',
          800: '#1c2032',
          900: '#121526',
          950: '#0a0c18',
        },
        amber: {
          50: '#fffaed',
          100: '#fff2c8',
          200: '#ffe388',
          300: '#ffcf40',
          400: '#ffb81c',
          500: '#f59e0b',
          600: '#d97a06',
          700: '#b45a09',
          800: '#92480e',
          900: '#783c10',
        },
        gold: {
          accent: '#ffb81c',
          hover: '#ffcf40',
          muted: '#92480e',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.34, 1.4, 0.64, 1)',
        'pop': 'pop 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'tab-enter': 'tabEnter 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(14px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 184, 28, 0.2)' },
          '50%': { boxShadow: '0 0 0 8px rgba(255, 184, 28, 0)' },
        },
        tabEnter: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.99)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
