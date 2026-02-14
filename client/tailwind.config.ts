import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        tet: {
          red: "#DC2626",
          "red-dark": "#991B1B",
          gold: "#F59E0B",
          "gold-dark": "#D97706",
        },
      },
      animation: {
        shake: "shake 0.6s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        "dust-1": "dustPuff 0.6s ease-out infinite",
        "dust-2": "dustPuff 0.6s ease-out 0.15s infinite",
        "dust-3": "dustPuff 0.6s ease-out 0.3s infinite",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        dustPuff: {
          "0%": { opacity: "0.7", transform: "translateX(0) translateY(-50%) scale(1)" },
          "100%": { opacity: "0", transform: "translateX(-14px) translateY(-50%) scale(0.2)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
