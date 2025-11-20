/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#2D3436',
          light: '#3d4547',
          dark: '#1d2426',
        },
        lightgray: {
          DEFAULT: '#DFE6E9',
          light: '#F5F7F8',
          dark: '#B2BEC3',
        },
        mint: {
          DEFAULT: '#00CEC9',
          light: '#55EFC4',
          dark: '#00B894',
        },
        primary: {
          50: '#e6fffe',
          100: '#b3fffc',
          200: '#80fffa',
          300: '#4dffef',
          400: '#1afff7',
          500: '#00CEC9',
          600: '#00b5b0',
          700: '#009c98',
          800: '#008380',
          900: '#006a68',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
