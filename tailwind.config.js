import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'doctor-blue': '#0066cc',
        'doctor-green': '#00cc66',
        'medical-red': '#cc0000',
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        doctor2go: {
          "primary": "#0066cc",
          "secondary": "#00cc66", 
          "accent": "#f59e0b",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      "light",
      "dark",
    ],
  },
}