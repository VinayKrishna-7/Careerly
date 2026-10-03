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
        // Bespoke Official Enterprise Slate Scale (neutral obsidian carbon, eliminates generic AI blue tint)
        slate: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#333741',
          800: '#1f2227',
          850: '#17191e',
          900: '#111317',
          950: '#0b0c0e',
        },
        // Authoritative Corporate Sapphire (replacing generic AI Tailwind electric blue)
        brand: {
          50: '#eff5ff',
          100: '#dbe7fe',
          200: '#bed3fe',
          300: '#92b6fc',
          400: '#5f94f8',
          500: '#2b6df5',
          600: '#1a56db',
          700: '#1442b0',
          800: '#13388c',
          900: '#143070',
          950: '#0d1d45',
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
