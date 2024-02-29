import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        button: "#5f43b2",
        "button-2": "#BB86FC",
        bg: "#121212",
        "dark-100": "#0a0118",
        "dark-200": "#221e2d",
        "dark-300": "#393643",
        "dark-400": "#575757",
        "dark-500": "#717171",
        "dark-600": "#8b8b8b",
        "primary-300": "#7a5af5",
        "primary-400": "#9271f9",
        "primary-500": "#a788fb",
        "primary-600": "#ba9ffc",
        border: "rgba(57,54,67,0.7)", // dark-300/70
      },
      borderColor: {
        card: "rgba(57,54,67,0.7)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-delay": {
          "0%": { opacity: "0" },
          "60%": { opacity: "0" },
          "100%": { opacity: "1", display: "flex" },
        },
        "flex-delay": {
          "0%": { display: "block" },
          "100%": { display: "flex" },
        },
      },
      animation: {
        "fade-in": "fade-in 250ms ease-in-out",
        "fade-out": "fade-out 250ms ease-in-out",
        "fade-in-delay":
          "1200ms ease-in-out 0s normal forwards 1 fade-in-delay",
        "flex-delay": "flex-delay 0ms forwards 600ms",
      },
      transitionProperty: {
        shrink: "height ease-in-out, width ease-in-out",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;

//#382bf2
