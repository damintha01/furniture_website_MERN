/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C3639',
          light: '#3F4E4F',
          dark: '#1B2430',
        },
        secondary: {
          DEFAULT: '#A27B5C',
          light: '#DCD7C9',
          dark: '#7B5C3D',
        },
      },
    },
  },
  plugins: [],
}
