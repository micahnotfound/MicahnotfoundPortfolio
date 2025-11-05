import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      width: {
        '68': '17rem',   // 272px
        '75': '18.75rem', // 300px
      },
      scale: {
        '108': '1.08',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        body: ['var(--font-epilogue)', 'Epilogue', 'system-ui', 'sans-serif'],
        ui: ['var(--font-epilogue)', 'Epilogue', 'system-ui', 'sans-serif'],
        enigma: ['var(--font-crimson)', 'Crimson Text', 'serif'],
      },
      fontSize: {
        'xs': ['9.6px', { lineHeight: '1.5' }],      // 12px * 0.8
        'sm': ['11.2px', { lineHeight: '1.5' }],     // 14px * 0.8
        'base': ['12.8px', { lineHeight: '1.5' }],   // 16px * 0.8
        'lg': ['14.4px', { lineHeight: '1.5' }],     // 18px * 0.8
        'xl': ['16px', { lineHeight: '1.5' }],       // 20px * 0.8
        '2xl': ['19.2px', { lineHeight: '1.5' }],    // 24px * 0.8
        '3xl': ['24px', { lineHeight: '1.25' }],     // 30px * 0.8
        '4xl': ['28.8px', { lineHeight: '1.25' }],   // 36px * 0.8
        '5xl': ['38.4px', { lineHeight: '1.1' }],    // 48px * 0.8
        '6xl': ['48px', { lineHeight: '1.1' }],      // 60px * 0.8
        '7xl': ['57.6px', { lineHeight: '1' }],      // 72px * 0.8
        '8xl': ['76.8px', { lineHeight: '1' }],      // 96px * 0.8
        '9xl': ['115.2px', { lineHeight: '1' }],     // 144px * 0.8
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'core-dark': '#2A033F',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fadeIn': 'fadeIn 0.7s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out infinite 1s',
        'float-slow': 'float 4s ease-in-out infinite 2s',
        'jello': 'jello 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        jello: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.02) skewX(-1deg)' },
          '40%': { transform: 'scale(0.98) skewX(1deg)' },
          '50%': { transform: 'scale(1.01) skewX(-0.5deg)' },
          '65%': { transform: 'scale(0.99) skewX(0.5deg)' },
          '75%': { transform: 'scale(1.005) skewX(-0.25deg)' },
          '100%': { transform: 'scale(1) skewX(0deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
