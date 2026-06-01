/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'packer-dark': '#09090B',
        'packer-teal': '#00CBA9',
        'packer-coral': '#FF7E5F',
        'packer-glass': 'rgba(255, 255, 255, 0.03)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
      },
      backdropBlur: {
        'xxl': '40px',
      }
    },
  },
  plugins: [],
}
