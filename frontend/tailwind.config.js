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
          50: '#ff2626',
          100: '#ffdefc',
          200: '#ff0290',
          300: '#ff0457',
          400: '#ffca54',
          500: '#ffbf30',
          600: '#ffb0a9',
          700: '#ffb0a7',
          800: '#ffaa82',
          900: '#ee9916',
        },
      },
    },
  },
  plugins: [],
}