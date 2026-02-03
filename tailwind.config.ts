import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        "void-light": "#0a0a0a",
        // 7 大分类色板
        growth: "#2d5016",
        "growth-glow": "#4a7c2c",
        family: "#5c3d7a",
        "family-glow": "#8b5cb8",
        career: "#1e3a5f",
        "career-glow": "#2d5a8c",
        leisure: "#1a5f6b",
        "leisure-glow": "#2d8fa3",
        social: "#8b3a6b",
        "social-glow": "#c45a94",
        health: "#8b3d2e",
        "health-glow": "#c45a42",
        wealth: "#8b6914",
        "wealth-glow": "#c49b28",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backdropBlur: {
        glass: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
