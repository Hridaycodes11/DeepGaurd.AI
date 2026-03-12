/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0f172a',
        accent: '#6366f1'
      },
      boxShadow: {
        glow: '0 0 40px rgba(99, 102, 241, 0.25)'
      }
    }
  },
  plugins: []
};
