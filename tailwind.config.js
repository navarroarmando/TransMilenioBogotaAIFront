/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
      colors: {
        primary: {
          dark: '#002E5E',
          light: '#015EB0',
          DEFAULT: '#015EB0',
        },
        accent: {
          DEFAULT: '#3EA32A',
          hover: '#2E7A1F',
        },
        background: {
          light: '#FFFFFF',
          dark: '#0A0E27',
        },
        surface: {
          light: '#F5F7FA',
          dark: '#121836',
        },
        text: {
          primary: {
            light: '#1A1A2E',
            dark: '#FFFFFF',
          },
          secondary: {
            light: '#4A5568',
            dark: '#CBD5E0',
          },
        },
        border: {
          light: '#E2E8F0',
          dark: '#1E293B',
        },
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
};
