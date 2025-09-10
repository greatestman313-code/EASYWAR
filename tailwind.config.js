module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}","./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { cairo: ['Cairo', 'sans-serif'] },
      colors: {
        bgdark: '#1f1f23',
        bgsoft: '#2a2a2f',
        neon: '#00e0ff'
      }
    }
  },
  plugins: []
}
