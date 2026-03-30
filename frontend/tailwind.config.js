/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          light: '#232F3E',
          DEFAULT: '#131921',
        },
      },
      scale: {
        '105': '1.05',
        '110': '1.10',
      }
    },
  },
  plugins: [],
}
