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
        "dark-100": "#121212",
        "dark-200": "#282828",
        "dark-300": "#3f3f3f",
        "dark-400": "#575757",
        "dark-500": "#717171",
        "dark-600": "#8b8b8b",
        "primary-400": "#9271f9",
        "primary-500": "#a788fb",
        "primary-600": "#ba9ffc",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;

//#382bf2
