/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Noir & Crème Dual System: Pure Cream in Bright Theme, Pure Jet Black in Dark Theme
        slate: {
          50: '#faf5eb',  // Bright theme background (Pure Cream)
          100: '#f3ecde', // Cream secondary / input background
          200: '#e5ded0', // Cream border
          300: '#d5ccba', // Defined cream border
          400: '#a39b8e', // Dark mode secondary text (soft warm cream-gray)
          500: '#756d61', // Secondary text
          600: '#423d35', // Bright mode secondary text (deep charcoal)
          700: '#2b2620',
          800: '#1c1c1f', // Dark mode card border
          850: '#141416', // Dark mode elevated surface
          900: '#0c0c0e', // Dark mode card surface / Bright mode deep black
          950: '#000000', // Dark mode background (Pure Jet Black)
        },
        // Brand scale: Black in Bright Theme, Cream in Dark Theme
        brand: {
          50: '#f3ecde',
          100: '#e5ded0',
          200: '#d5ccba',
          300: '#faf5eb',
          400: '#faf5eb', // In dark mode, text-brand-400 resolves to Cream!
          500: '#000000',
          600: '#000000', // In bright mode, bg-brand-600 resolves to Black!
          700: '#171717',
          800: '#262626',
          900: '#000000',
          950: '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        floating: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
