/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a8b9',
          400: '#ec7592',
          500: '#e04470',
          600: '#cc2556',
          700: '#ab1845',
          800: '#8f1740',
          900: '#7b163c',
          950: '#44071e',
        },
        burgundy: {
          DEFAULT: '#722F37',
          dark: '#4a1a1f',
          deeper: '#2d0f13',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#e8c96e',
          pale: '#f5e6bc',
        },
        cream: {
          DEFAULT: '#FAF3E0',
          dark: '#f0e6c8',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'wine-gradient': 'linear-gradient(135deg, #2d0f13 0%, #722F37 50%, #4a1a1f 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #e8c96e 50%, #C9A84C 100%)',
      },
      boxShadow: {
        'wine': '0 4px 24px rgba(114, 47, 55, 0.3)',
        'wine-lg': '0 8px 40px rgba(114, 47, 55, 0.4)',
        'gold': '0 4px 16px rgba(201, 168, 76, 0.3)',
        'card': '0 2px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
