/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media', // or 'class' - usually 'media' is default but 'class' is better for toggles. App.tsx mentions dark: classes. I'll stick to default or media for now unless I see a toggle. 
  // Wait, App.tsx has `className="... dark:bg-background-dark ..."`
  // If there is no explicit dark mode toggle in the code (I didn't see a context provider), it might rely on system preference.
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0b2a5b',
          light: '#1d4ed8', // keeping a light variant just in case, but DEFAULT is critical
          dark: '#081c3e', // darker shade of #0b2a5b
        },
        background: {
          light: '#f2f3f5',
          dark: '#111721',
        },
        // Preserve other existing colors if any, but these are the critical overrides
      },
    },
  },
  plugins: [],
}
