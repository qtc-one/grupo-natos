/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Aeonik', 'sans-serif'],
    },
    fontWeight: {
      normal: '400',
      bold: '500',
    },
    colors: {
      transparent: 'transparent',
      neutral: {
        dark: {
          DEFAULT: '#000',
          30: 'rgba(0,0,0,.3)',
          40: 'rgba(0,0,0,.4)',
          50: 'rgba(0,0,0,.5)',
          60: 'rgba(0,0,0,.6)',
          70: 'rgba(0,0,0,.7)',
          100: '#1A1C1E',
        },
        light: {
          DEFAULT: '#fff',
          30: 'rgba(255,255,255,.3)',
          40: 'rgba(255,255,255,.4)',
          50: 'rgba(255,255,255,.5)',
          60: 'rgba(255,255,255,.6)',
          70: 'rgba(255,255,255,.7)',
          100: '#F0F1F5',
        },
        100: '#8C8C8C',
        200: '#727475',
      },
      blue: {
        DEFAULT: '#0047BA',
      },
      green: {
        DEFAULT: '#00A473',
      },
      red: {
        DEFAULT: '#EC5E3F',
      },
    },
    boxShadow: {
      1: '0px 12px 23px rgba(0, 0, 0, 0.05)',
      2: '0px 15px 45px rgba(0, 0, 0, 0.1)',
      3: '0px 0px 19px rgba(0, 0, 0, 0.25)',
    },
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
}
