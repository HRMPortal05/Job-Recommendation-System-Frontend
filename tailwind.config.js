/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EFF6FF", // blue-50
          100: "#DBEAFE", // blue-100
          200: "#BFDBFE", // blue-200
          300: "#93C5FD", // blue-300
          400: "#60A5FA", // blue-400
          DEFAULT: "#2563eb", // blue-600
          500: "#3B82F6", // blue-500
          600: "#2563eb", // blue-600
          700: "#1d4ed8", // blue-700
          800: "#1e40af", // blue-800
          900: "#1e3a8a", // blue-900
          950: "#172554", // blue-950
          hover: "#1d4ed8", // blue-700
          dark: "#3B82F6", // blue-500 for dark mode
          dark_hover: "#2563eb", // blue-600 for dark mode hover
        },
        success: {
          50: "#F0FDF4", // green-50
          100: "#DCFCE7", // green-100
          200: "#BBF7D0", // green-200
          300: "#86EFAC", // green-300
          400: "#4ADE80", // green-400
          DEFAULT: "#22C55E", // green-500
          500: "#22C55E", // green-500
          600: "#16A34A", // green-600
          700: "#15803D", // green-700
          800: "#166534", // green-800
          900: "#14532D", // green-900
          950: "#052e16", // green-950
          dark: "#4ADE80", // green-400 for dark mode
        },
        accent: {
          50: "#FAF5FF", // purple-50
          100: "#F3E8FF", // purple-100
          200: "#E9D5FF", // purple-200
          300: "#D8B4FE", // purple-300
          400: "#C084FC", // purple-400
          DEFAULT: "#A855F7", // purple-500
          500: "#A855F7", // purple-500
          600: "#9333EA", // purple-600
          700: "#7E22CE", // purple-700
          800: "#6B21A8", // purple-800
          900: "#581C87", // purple-900
          950: "#3b0764", // purple-950
          dark: "#C084FC", // purple-400 for dark mode
        },
        warning: {
          50: "#FFF7ED", // orange-50
          100: "#FFEDD5", // orange-100
          200: "#FED7AA", // orange-200
          300: "#FDBA74", // orange-300
          400: "#FB923C", // orange-400
          DEFAULT: "#F97316", // orange-500
          500: "#F97316", // orange-500
          600: "#EA580C", // orange-600
          700: "#C2410C", // orange-700
          800: "#9A3412", // orange-800
          900: "#7C2D12", // orange-900
          950: "#431407", // orange-950
          dark: "#FB923C", // orange-400 for dark mode
        },
        surface: {
          50: "#F9FAFB", // gray-50
          100: "#F3F4F6", // gray-100
          200: "#E5E7EB", // gray-200
          300: "#D1D5DB", // gray-300
          400: "#9CA3AF", // gray-400
          DEFAULT: "#FFFFFF", // white
          dark: "#1f2937", // gray-900
          overlay: "rgba(255, 255, 255, 0.95)", // white/95
          dark_overlay: "rgba(17, 24, 39, 0.95)", // gray-900/95
        },
        border: {
          light: "#F3F4F6", // gray-100
          DEFAULT: "#E5E7EB", // gray-200
          medium: "#D1D5DB", // gray-300
          dark: "#374151", // gray-700
          darker: "#1F2937", // gray-800
        },
        text: {
          primary: "#111827", // gray-900
          secondary: "#4B5563", // gray-600
          tertiary: "#6B7280", // gray-500
          muted: "#9CA3AF", // gray-400
          dark_primary: "#FFFFFF", // white
          dark_secondary: "#9CA3AF", // gray-400
          dark_tertiary: "#D1D5DB", // gray-300
          dark_muted: "#6B7280", // gray-500
        },
        hover: {
          light: "#F9FAFB", // gray-50
          DEFAULT: "#F3F4F6", // gray-100
          medium: "#E5E7EB", // gray-200
          dark: "#1F2937", // gray-800
          darker: "#111827", // gray-900
        },
        background: {
          light: "#FFFFFF", // white
          DEFAULT: "#F9FAFB", // gray-50
          dark: "#111827", // gray-900
          darker: "#030712", // gray-950
        },
      },
    },
  },
  plugins: [],
};
