import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VendorHub Run Your Business the Smart Way',
  description: 'The all-in-one POS & inventory platform for Nigerian market vendors. Track stock, manage sales, and send Email, SMS & WhatsApp alerts — all from your phone.',
  generator: 'Next.js',
  icons: {
    icon: [
      {
        url: '',
        media: '(prefers-color-scheme: light)',
      },
     
    ],
    apple: '',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={plusJakartaSans.className}>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
