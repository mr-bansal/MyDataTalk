/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'dark-glow': 'linear-gradient(160deg, #000000 50%, #7c1818 75%, #541b3f 95%)',
      },
      keyframes: {
        'slow-pan': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
      animation: {
        'pan-gradient': 'slow-pan 5s ease infinite',
      },
      backgroundSize: {
        '400%': '400% 400%',
      },
    },
  },
  variants: {},
  plugins: [],
}