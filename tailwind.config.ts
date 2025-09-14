import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0e0f13",
        panel: "#151821",
        neon: "#35b6ff",
        sky: "#7cd2ff"
      },
      fontFamily: {
        cairo: ["var(--font-cairo)"]
      }
    },
  },
  plugins: [],
} satisfies Config;
