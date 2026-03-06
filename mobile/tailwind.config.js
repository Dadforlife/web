/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2F5BFF",
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#2F5BFF",
          600: "#2545d9",
          700: "#1d38b3",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        surface: "#F5F6FA",
      },
    },
  },
  plugins: [],
};
