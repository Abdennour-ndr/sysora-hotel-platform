/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sysora': {
          'midnight': '#002D5B',
          'midnight-light': '#1A4B73',
          'midnight-dark': '#001A35',
          'mint': '#2EC4B6',
          'mint-light': '#4FD1C7',
          'mint-dark': '#26A69A',
          'light': '#F9FAFB',
        },
        'success': {
          DEFAULT: '#10B981',
          'light': '#34D399',
          'dark': '#059669',
        },
        'warning': {
          DEFAULT: '#F59E0B',
          'light': '#FBBF24',
          'dark': '#D97706',
        },
        'error': {
          DEFAULT: '#EF4444',
          'light': '#F87171',
          'dark': '#DC2626',
        },
        'info': {
          DEFAULT: '#3B82F6',
          'light': '#60A5FA',
          'dark': '#2563EB',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
