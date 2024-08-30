/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // THIS CRAP AIN'T WORKING
    // TODO: Fix this
    `scale-100`,
    `scale-150`,
    `scale-200`,
    `scale-250`,
    `scale-300`,
  ],
  theme: {
    extend: {
      scale: {
        '200': '2.00',
        '250': '2.50',
        '300': '3.00',
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};

module.exports = config;
