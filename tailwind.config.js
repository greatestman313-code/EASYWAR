/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}","./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { cairo: ['Cairo', 'sans-serif'] },
      colors: {
        bgdark: '#1f1f23',
        bgsoft: '#2a2a2f',
        neon: '#00E0FF'
      }
    }
  },
  plugins: []
};
