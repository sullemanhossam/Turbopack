/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/**/*.{html,js,jsx,tsx}",
    "./src/pages/**/*.{html,js}",
    "./src/components/**/*.{html,js,jsx,tsx}",
    "./src/layouts/**/*.{html,js}",
    "./src/index.html",
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
