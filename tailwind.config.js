/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#0b2a5b",
        "sky-blue": "#8FD9F6",
        "background-light": "#f6f7f8", // Updated to match user
        "background-dark": "#111721",
        "card-blue": "#CFEFFF",
        // Keeping nested structure as alias if needed, but defining top-level for direct matching of user classes
        background: {
          light: '#f6f7f8',
          dark: '#111721',
        },
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0.5rem", "lg": "1rem", "xl": "1.5rem", "2xl": "2rem", "full": "9999px" },
    },
  },
  plugins: [],
}
