import type { Config } from 'tailwindcss'
const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          neon: '#3aa8ff',
          sky: '#7de3ff'
        },
        bg: {
          DEFAULT: '#0f1216',
          soft: '#151922',
          softer: '#1b2030'
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
}
export default config
