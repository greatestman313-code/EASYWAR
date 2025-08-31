import type { Config } from 'tailwindcss'
export default {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { neon: { blue: '#34d1ff' } } } },
  darkMode: 'class',
  plugins: [],
} satisfies Config
