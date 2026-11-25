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
        // System Color Hierarchy: Primary = White, Secondary = Black, Tertiary = Red
        brand: {
          primary: "#FFFFFF",     // Primary: Crisp Pure White
          secondary: "#0A0A0B",   // Secondary: Deep Pitch Black
          tertiary: "#E53935",    // Tertiary: Tactical Crimson Red
        },
        obsidian: {
          bg: "#0A0A0B",          // Main Background (Black)
          surface: "#151518",     // Secondary Surface (Black/Charcoal)
          elevated: "#242428",    // Elevated Surface (Deep Slate)
          border: "#303035",      // Borders / Dividers
          text: "#FFFFFF",        // Primary Text (White)
          secondary: "#A1A1AA",   // Secondary Text (Gray)
          muted: "#77777F",       // Muted Text
          accent: "#E53935",      // Tertiary Accent (Red)
          hover: "#A71919",       // Tertiary Hover (Deep Red)
          deepRed: "#A71919",
          white: "#FFFFFF",       // Primary
          black: "#000000",       // Secondary
        },
        redline: {
          bg: "#0A0A0B",
          graphite: "#151518",
          panel: "#242428",
          border: "#303035",
          red: "#E53935",
          crimson: "#A71919",
          blood: "#A71919",
          text: "#FFFFFF",
          secondary: "#A1A1AA",
          muted: "#77777F",
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
        "primary-glow": "0 0 25px rgba(255, 255, 255, 0.18)",
        "tertiary-glow": "0 0 25px rgba(229, 57, 53, 0.3)",
        "obsidian-elevated": "0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px #303035",
        "tactical-inset": "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      },
      animation: {
        pulse_slow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
