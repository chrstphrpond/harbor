import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1A2F',
          50: '#E6EAF0',
          100: '#CDD5E1',
          500: '#0A1A2F',
          900: '#050D17',
        },
        slate: {
          DEFAULT: '#3E4A57',
        },
        sand: {
          DEFAULT: '#D9D4C7',
        },
        teal: {
          DEFAULT: '#238F8F',
          50: '#E6F5F5',
          100: '#CCEBEB',
          500: '#238F8F',
          600: '#1C7272',
        },
      },
    },
  },
  plugins: [],
}
export default config
