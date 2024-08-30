/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    `scale-100`,
    `scale-150`,
    `scale-200`,
    `scale-250`,
    `scale-300`,
    `scale-350`,
    `scale-400`,
    `scale-450`,
    `scale-500`,
  ],
  theme: {
    extend: {
      scale: {
        '200': '2.00',
        '250': '2.50',
        '300': '3.00',
        '350': '3.50',
        '400': '4.00',
        '450': '4.50',
        '500': '5.00',
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};

module.exports = config;
