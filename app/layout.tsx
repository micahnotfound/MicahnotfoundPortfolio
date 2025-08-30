import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/shared/Header'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Micah Milner - Creative Strategist',
  description: 'Creative strategist specializing in immersive media and XR storytelling, with success in bringing complex cultural and environmental narratives to life.',
  metadataBase: new URL('https://micahmilner.com'),
  openGraph: {
    title: 'Micah Milner - Creative Strategist',
    description: 'Creative strategist specializing in immersive media and XR storytelling.',
    type: 'website',
    url: 'https://micahmilner.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Micah Milner - Creative Strategist',
    description: 'Creative strategist specializing in immersive media and XR storytelling.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
        >
          Skip to main content
        </a>
        
        <Header />
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  )
}
