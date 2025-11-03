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
    <div className="flex max-w-7xl mx-auto overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-8 py-8 sm:py-12 lg:pr-16 w-full lg:max-w-3xl lg:mx-auto overflow-x-hidden">
        <h2 className="text-sm text-[#ff8c00] font-mono mb-2">{breadcrumb}</h2>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-white font-mono break-words">{title}</h1>
        
        {subtitle && (
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-8 sm:mb-12 font-mono">
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
        <div className="hidden lg:block">
          <TableOfContents sections={tocSections} />
        </div>
      )}
    </div>
  )
}
