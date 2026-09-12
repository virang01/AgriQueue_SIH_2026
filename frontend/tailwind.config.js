/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gov: {
          white: '#ffffff',
          gray: '#f8f9fa',
          red: '#c62828',
          'red-hover': '#a81f1f',
          'red-light': '#fdecea',
          green: '#2e7d32',
          'green-light': '#e8f5e9',
          amber: '#f9a825',
          'amber-light': '#fff8e1',
          text: '#1a1a1a',
          muted: '#5f6368',
          border: '#e0e0e0',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Noto Sans', 'system-ui', 'sans-serif'],
      },
      spacing: {
        navbar: 'var(--navbar-height, 104px)',
      },
    },
  },
  plugins: [],
};
