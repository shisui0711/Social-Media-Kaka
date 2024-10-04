/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Inter: ["Inter_400Regular", "sans-serif"],
        InterBold: ["Inter_700Bold", "sans-serif"],
        InterExtraBold: ["Inter_800ExtraBold", "sans-serif"],
        InterExtraLight: ["Inter_200ExtraLight", "sans-serif"],
        InterLight: ["Inter_300Light", "sans-serif"],
        InterMedium: ["Inter_500Medium", "sans-serif"],
        InterSemiBold: ["Inter_600SemiBold", "sans-serif"],
      },
      borderWidth: {
        1: "1px",
        2: "2px",
      },
      colors: {
        border: "#E2E8F0",
        input: "#E4E4E7",
        ring: "#2563EB",
        background: "#F2F2F3",
        foreground: "#020817",
        primary: {
          DEFAULT: "#2563EB",
          foreground: "#F8FAFC",
        },
        secondary: {
          DEFAULT: "#F1F5F9",
          foreground: "#0F172A",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FAFAFA",
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#F4F4F5",
          foreground: "#0F172A",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#020817",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#020817",
        },
      },
      borderRadius: {
        lg: "16",
        md: "14",
        sm: "12",
      },
    },
  },
  plugins: [],
};
