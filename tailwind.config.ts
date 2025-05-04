import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "#FFFFFF",
        foreground: "#1A1A1A",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A1A",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A1A",
        },
        primary: {
          DEFAULT: "#DD7230", // Main amber/orange
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#B85A25", // Darker amber
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F8F8F8",
          foreground: "#737373",
        },
        accent: {
          DEFAULT: "#F39C6B", // Lighter amber
          foreground: "#1A1A1A",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        border: "#E5E5E5",
        input: "#E5E5E5",
        ring: "#DD7230",
        chart: {
          "1": "#DD7230",
          "2": "#F39C6B",
          "3": "#B85A25",
          "4": "#FFC09F",
          "5": "#A44A1B",
        },
        sidebar: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A1A",
          primary: "#DD7230",
          "primary-foreground": "#FFFFFF",
          accent: "#F39C6B",
          "accent-foreground": "#1A1A1A", 
          border: "#E5E5E5",
          ring: "#DD7230",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
