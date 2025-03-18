/** @type {import('tailwindcss').Config} */
const colors = require("./config/colors");
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily: {
        'kaisei': ['KaiseiDecol_400Regular'],
        'kaisei-medium': ['KaiseiDecol_500Medium'],
        'kaisei-bold': ['KaiseiDecol_700Bold'],
        'heebo': ['Heebo_400Regular'],
        'heebo-medium': ['Heebo_500Medium'],
        'heebo-bold': ['Heebo_700Bold'],
      },
    },
  },
  plugins: [],
}