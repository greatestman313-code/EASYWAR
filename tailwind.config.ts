
import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: '#38bdf8',
        dark: '#0b0f14',
        slate: { 900: '#0f172a', 800: '#1e293b', 700: '#334155' }
      },
      fontFamily: { cairo: ['Cairo', 'ui-sans-serif', 'system-ui'] }
    }
  }
}
export default config
