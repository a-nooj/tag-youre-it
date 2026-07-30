/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FDFCF8',
        foreground: '#2C2C24',
        primary: '#5D7052',
        'primary-foreground': '#F3F4F1',
        secondary: '#C18C5D',
        'secondary-foreground': '#2C2C24',
        accent: '#E6DCCD',
        'accent-foreground': '#4A4A40',
        muted: '#F0EBE5',
        'muted-foreground': '#78786C',
        border: '#DED8CF',
        destructive: '#A85448',
      },
      fontFamily: {
        heading: ['Fraunces', 'serif'],
        body: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'organic': '60% 40% 30% 70% / 60% 30% 70% 40%',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(93, 112, 82, 0.15)',
        'float': '0 10px 40px -10px rgba(193, 140, 93, 0.2)',
      },
    },
  },
  plugins: [],
}
