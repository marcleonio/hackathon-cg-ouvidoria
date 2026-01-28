/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: '#005CA9',
          dark: '#003366',
          yellow: '#F2C94C',
        },
        hc: {
          bg: '#000000',
          text: '#FFFF00',
          border: '#FFFF00',
        }
      },
    },
  },
  plugins: [],
}
