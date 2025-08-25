import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Good to keep this if you ever move components outside /app
    ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        lightgray: "#f3f4f6",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        sofia: ["var(--font-sofia-sans)", "sans-serif"],
      },
      backgroundImage: {
        "city-pattern": "url('/city-background.svg')",
      },
    },
  },
  plugins: [],
};
export default config;