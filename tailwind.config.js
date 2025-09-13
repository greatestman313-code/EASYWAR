/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bgdark: "#0f1115",
        bgsoft: "#161A22",
        neon: "#B5FF4A"
      }
    },
  },
  plugins: [],
};
