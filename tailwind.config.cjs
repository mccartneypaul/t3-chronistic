/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    `scale-100`,
    `scale-150`,
    `scale-200`,
    `scale-250`,
    `scale-300`,
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};

module.exports = config;
