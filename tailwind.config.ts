import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#d9e9ff",
          500: "#2f69ff",
          600: "#1f56e1",
          700: "#1845b4"
        }
      },
      boxShadow: {
        card: "0 10px 24px -12px rgba(15, 23, 42, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
