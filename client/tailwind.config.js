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
        // Warm Cream for Bright Theme, Pure Jet Black for Dark Theme (from user image)
        slate: {
          50: '#fcfaf6',  // Warm Editorial Cream Canvas
          100: '#f4f0e6', // Cream surface / input background / chip
          200: '#e8e2d4', // Hairline cream card border
          300: '#d7cec0', // Defined border & divider
          400: '#9d9484', // Light mode placeholder / dark mode secondary text
          500: '#6d6556', // Light mode subtle text
          600: '#4a4338', // Light mode body secondary
          700: '#2e3037', // Dark mode divider
          800: '#1b1d22', // Dark mode card border & elevated input
          850: '#121418', // Dark mode hover surface
          900: '#0c0d10', // Dark mode card surface / Light mode crisp text
          950: '#000000', // Pure Jet Black from user image
        },
        // Exact Sky Cyan (#9ad9ea) from user image, scaled for high visibility on cream
        brand: {
          50: '#f0f9ff',  // Soft ice cyan
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#9ad9ea', // User's exact sky cyan (R=154 G=217 B=234)
          400: '#38bdf8', // Luminous sky cyan
          500: '#0ea5e9', // Vibrant cyan azure
          600: '#0284c7', // Deep Ocean Cerulean — bold & clearly visible on cream
          700: '#0369a1', // Deep Marine Navy — hover state
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
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
