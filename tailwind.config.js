/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  content: ['./index.html', './src/**/*.{html,js,tsx,jsx}'],
  theme: {
    extend: {
      colors: {
        lightGray: '#323644',
        deepGray: '#272a37'
      },
      backgroundImage: {
        temple: "url('@/assets/background.jpeg')"
      }
    }
  },
  plugins: []
};
