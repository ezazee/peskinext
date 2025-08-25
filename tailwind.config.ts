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
        primary: "#1D9AD2",
        secondary: "#045880",
        tertiary: "#E8F5FA",
        "base-text": "#374151",
        "subtle-text": "#6B7280",
        "border-color": "#D1D5DB",
      },
      boxShadow: {
        "focus-glow": "0 0 0 3px rgba(29, 154, 210, 0.4)",
      },
      spacing: {
        'safe-area-inset-bottom': 'env(safe-area-inset-bottom)',
      },
      padding: {
        'safe-area-inset-bottom': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [],
};
export default config;
