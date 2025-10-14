/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Use class-based dark mode instead of media queries
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
      },
      colors: {
        // Define consistent colors to prevent device variations
        'card-light': '#ffffff',
        'card-dark': '#1a1a1a',
        'card-border-light': '#e5e7eb',
        'card-border-dark': '#374151',
        'card-bg-light': 'rgba(255, 255, 255, 0.6)',
        'card-bg-dark': 'rgba(26, 26, 26, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
