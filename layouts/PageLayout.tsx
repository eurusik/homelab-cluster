import { ReactNode } from 'react'
import TableOfContents from '@/components/TableOfContents'
import PageNavigation from '@/components/PageNavigation'
import Footer from '@/components/Footer'

interface TocSection {
  id: string
  label: string
}

interface PageLayoutProps {
  children: ReactNode
  breadcrumb?: string
  title: string
  subtitle?: ReactNode
  tocSections?: TocSection[]
  prevPage?: { href: string; label: string }
  nextPage?: { href: string; label: string }
}

export default function PageLayout({
  children,
  breadcrumb = 'My Homelab',
  title,
  subtitle,
  tocSections,
  prevPage,
  nextPage,
}: PageLayoutProps) {
  return (
    <div className="flex max-w-7xl mx-auto">
      {/* Main Content */}
      <div className="flex-1 px-8 py-12 pr-16 max-w-3xl mx-auto">
        <h2 className="text-sm text-[#ff8c00] font-mono mb-2">{breadcrumb}</h2>
        <h1 className="text-5xl font-bold mb-8 text-white font-mono">{title}</h1>
        
        {subtitle && (
          <p className="text-xl text-gray-400 mb-12 font-mono">
            {subtitle}
          </p>
        )}

        {children}

        {/* Navigation Buttons */}
        {(prevPage || nextPage) && (
          <PageNavigation prevPage={prevPage} nextPage={nextPage} />
        )}

        <Footer />
      </div>

      {/* Right Sidebar - On this page */}
      {tocSections && tocSections.length > 0 && (
        <TableOfContents sections={tocSections} />
      )}
    </div>
  )
}
