import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers'
import { Header } from '@/components/Header'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'rCal | Relational Calendar',
  description: 'Spatiotemporal calendar with lunar overlay and multi-granularity navigation',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📅</text></svg>",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script defer src="https://rdata.online/collect.js" data-website-id="ea665b3c-ac4f-40cd-918e-1f99c5c69fac" />
      </head>
      <body className="bg-gray-900 min-h-screen text-gray-100">
        <Providers>
          <Header current="cal" />
          {children}
        </Providers>
      </body>
    </html>
  )
}
