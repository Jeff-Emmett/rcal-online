import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'rCal | Relational Calendar',
  description: 'Spatiotemporal calendar with lunar overlay and multi-granularity navigation',
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
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
