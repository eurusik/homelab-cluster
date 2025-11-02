import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  metadataBase: new URL('https://homelab.eurusik.com'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  title: {
    default: 'K3s Homelab - Eugene Rusakov',
    template: '%s | K3s Homelab',
  },
  description: 'Complete guide to building a Raspberry Pi K3s Kubernetes cluster. Step-by-step tutorials for homelab setup, networking, and container orchestration.',
  keywords: ['kubernetes', 'k3s', 'raspberry pi', 'homelab', 'cluster', 'docker', 'devops', 'self-hosted', 'raspberry pi cluster', 'k3s tutorial'],
  authors: [{ name: 'Eugene Rusakov' }],
  creator: 'Eugene Rusakov',
  publisher: 'Eugene Rusakov',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://homelab.eurusik.com',
    title: 'K3s Homelab - Eugene Rusakov',
    description: 'Complete guide to building a Raspberry Pi K3s Kubernetes cluster',
    siteName: 'K3s Homelab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K3s Homelab - Eugene Rusakov',
    description: 'Complete guide to building a Raspberry Pi K3s Kubernetes cluster',
    creator: '@eurusik',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff8c00" />
      </head>
      <body className="bg-[#0a0a0a] text-gray-200">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
