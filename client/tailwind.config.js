/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f3',
          100: '#fbe9e7',
          200: '#f7d2ce',
          300: '#f1b0a9',
          400: '#e88278',
          500: '#dc5b4f',
          600: '#c84438',
          700: '#a8362c',
          800: '#8b2f27',
          900: '#742c26',
          950: '#3f130f',
        },
      },
    },
  },
  plugins: [],
}
