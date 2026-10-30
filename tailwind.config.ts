import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        redline: {
          bg: "#08090d",
          panel: "#0e1117",
          card: "#131722",
          border: "rgba(255, 255, 255, 0.08)",
          red: "#ef4444",
          crimson: "#dc2626",
          blood: "#991b1b",
          emerald: "#10b981",
          gold: "#f59e0b",
        },
        cyber: {
          bg: "#08090d",
          card: "#0f121a",
          panel: "#141824",
          border: "#1f2636",
          neon: "#ef4444",
          emerald: "#10b981",
          gold: "#f59e0b",
          cyan: "#06b6d4",
          crimson: "#ef4444",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(239, 68, 68, 0.25)",
        "glow-gold": "0 0 25px -5px rgba(245, 158, 11, 0.25)",
      },
      animation: {
        pulse_slow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
