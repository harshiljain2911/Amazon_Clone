/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        amz: {
          navy:      '#131921',   // main navbar bg
          navyLight: '#232f3e',   // secondary navbar + footer bg
          navyMid:   '#37475a',   // footer top band
          navyDark:  '#0f1111',   // primary text
          orange:    '#febd69',   // accent
          orangeHot: '#f3a847',   // accent hover
          yellow:    '#ffd814',   // primary button
          yellowHov: '#f7ca00',   // primary button hover
          page:      '#f3f3f3',   // page background
          card:      '#ffffff',
          border:    '#dddddd',
          text:      '#0f1111',
          muted:     '#565959',
          link:      '#007185',
          linkHov:   '#c7511f',
          prime:     '#00a8e0',
          success:   '#067d62',
        },
      },
      boxShadow: {
        'amz-card': '0 2px 5px 0 rgba(213,217,217,.5)',
        'amz-nav':  '0 2px 4px -1px rgba(0,0,0,0.3)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        fadeIn:  'fadeIn 0.6s ease forwards',
      },
      scale: {
        '102': '1.02',
        '105': '1.05',
      },
    },
  },
  plugins: [],
}
