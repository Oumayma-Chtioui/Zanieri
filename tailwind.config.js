/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B1A18",
          50: "#F4F3F1",
          100: "#E4E2DD",
          200: "#C7C3B9",
          300: "#9B9585",
          400: "#6E6858",
          500: "#4A4539",
          600: "#332F26",
          700: "#26221C",
          800: "#1B1A18",
          900: "#100F0E",
        },
        ivory: {
          DEFAULT: "#F8F5EF",
          soft: "#F3EFE7",
        },
        bone: {
          DEFAULT: "#EAE3D3",
          dark: "#DCD2B8",
        },
        bronze: {
          DEFAULT: "#8A6F41",
          light: "#A98C5D",
          dark: "#5F4C2C",
        },
        pine: {
          DEFAULT: "#2B3328",
          light: "#3E4838",
        },
        thread: "#C4B896",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-jost)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.22em",
      },
      borderRadius: {
        tag: "2px",
      },
      boxShadow: {
        tag: "0 1px 0 rgba(27,26,24,0.08), 0 8px 24px -12px rgba(27,26,24,0.25)",
        soft: "0 10px 40px -18px rgba(27,26,24,0.35)",
      },
      backgroundImage: {
        grain: "url('/grain.svg')",
      },
      keyframes: {
        drawSignature: {
          "0%": { strokeDashoffset: "1400", opacity: "0" },
          "8%": { opacity: "1" },
          "100%": { strokeDashoffset: "0", opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        signature: "drawSignature 2.2s ease-out forwards",
        fadeUp: "fadeUp 0.7s ease-out forwards",
      },
    },
  },
  plugins: [],
};
