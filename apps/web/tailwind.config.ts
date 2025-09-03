import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFF9F4',
        primary: '#7ED9A3',
        accent: '#FFC8A2',
        charcoal: '#1F1F1F',
      },
    },
  },
  plugins: [typography],
}

export default config
