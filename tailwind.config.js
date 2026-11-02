/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        office: {
          bg: '#181b26',
          floor: '#252936',
          accent: '#4f46e5',
        }
      },
      fontFamily: {
        game: ['Nunito', 'Segoe UI', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        waterWave: {
          '0%': { transform: 'translateX(0) scaleY(1)' },
          '50%': { transform: 'translateX(5px) scaleY(1.05)' },
          '100%': { transform: 'translateX(0) scaleY(1)' },
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        waterWave: 'waterWave 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
