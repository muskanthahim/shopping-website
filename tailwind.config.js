/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ivory: '#FAF8F5',
          cream: '#F4EFEA',
          sand: '#EAE3D9',
          taupe: '#8C8275',
          taupeLight: '#D8CFC4',
          dustyRose: '#C8968C',
          dustyRoseLight: '#F5ECE8',
          charcoal: '#1A1A1A',
          mutedDark: '#2D2B2A',
          warmGray: '#5A5652',
          gold: '#C5A059'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Bodoni Moda"', 'serif']
      },
      aspectRatio: {
        'portrait': '3 / 4',
        'tall': '2 / 3'
      }
    },
  },
  plugins: [],
}
