import {nextui} from '@nextui-org/theme'


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        backcard:{
          100: '#18181b'
        },
        primary: {
          100: '#DBFDE9',
          200: '#B7FCDB',
          300: '#92F8D1',
          400: '#75F2CE',
          500: '#49EACB',
          600: '#35C9BA',
          700: '#24A8A8',
          800: '#177D87',
          900: '#0E5D70',
          DEFAULT: '#49EACB'
        },
        secondary: {
          100: '#E6FCF0',
          200: '#CDF9E6',
          300: '#AFEED9',
          400: '#94DDCB',
          500: '#70C7BA',
          600: '#51ABA6',
          700: '#388C8F',
          800: '#236973',
          900: '#154E5F',
          DEFAULT: '#70C7BA'
        },
        success: {
          100: '#EBFBDA',
          200: '#D4F8B6',
          300: '#B1EA8D',
          400: '#8DD66C',
          500: '#5DBC40',
          600: '#41A12E',
          700: '#298720',
          800: '#166D14',
          900: '#0C5A10',
          DEFAULT: '#5DBC40'
        },
        warning: {
          100: '#FEFBD0',
          200: '#FDF7A1',
          300: '#FBF072',
          400: '#F8E94E',
          500: '#F4DE16',
          600: '#D1BC10',
          700: '#AF9B0B',
          800: '#8D7C07',
          900: '#756504',
          DEFAULT: '#F4DE16'
        },
        danger: {
          100: '#FFEBDA',
          200: '#FFD1B5',
          300: '#FFB290',
          400: '#FF9475',
          500: '#FF6247',
          600: '#DB3F33',
          700: '#B72325',
          800: '#931621',
          900: '#7A0D1F',
          DEFAULT: '#FF6247'
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
