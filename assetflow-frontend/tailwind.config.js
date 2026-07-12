/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#b3c7ff',
          400: '#80a3ff',
          500: '#4d7cff',
          600: '#2654ff',
          700: '#143fff',
          800: '#0c2db3',
          900: '#081e80',
          950: '#040f4d',
        },
      },
    },
  },
  plugins: [],
}
