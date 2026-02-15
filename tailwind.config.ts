import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lunar: {
          new: '#1e1b4b',        // Deep indigo (new moon - dark)
          waxing: '#4338ca',     // Indigo (waxing crescent)
          first: '#6366f1',      // Indigo-lighter (first quarter)
          gibbous: '#818cf8',    // Light indigo (waxing gibbous)
          full: '#fbbf24',       // Amber (full moon - bright)
          waning: '#a78bfa',     // Violet (waning gibbous)
          last: '#7c3aed',       // Purple (last quarter)
          crescent: '#4c1d95',   // Deep purple (waning crescent)
          eclipse: '#dc2626',    // Red (eclipses)
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
