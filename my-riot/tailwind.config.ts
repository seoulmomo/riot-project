import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1080px", // lg 브레이크포인트를 1080px로 변경
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [require("daisyui")],
} satisfies Config;
