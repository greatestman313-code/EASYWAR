/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        'ew-bg': '#0b0f14',
        'ew-panel': '#11161d',
        'ew-muted': '#1a212b',
        'ew-accent': '#00B2FF',
        'ew-accent-2': '#66E0FF'
      },
      fontFamily: {
        cairo: ['Cairo', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'ew': '0 2px 16px rgba(0,0,0,.35)'
      }
    }
  },
  plugins: [],
};
