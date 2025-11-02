import Link from 'next/link'

interface PageNavigationProps {
  prevPage?: {
    href: string
    label: string
  }
  nextPage?: {
    href: string
    label: string
  }
}

export default function PageNavigation({ prevPage, nextPage }: PageNavigationProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-16 mb-12">
      {prevPage ? (
        <Link 
          href={prevPage.href}
          className="border border-[#ff8c00] text-[#ff8c00] rounded-lg p-4 hover:bg-[#ff8c00] hover:text-black transition font-mono text-center"
        >
          ← {prevPage.label}
        </Link>
      ) : (
        <div />
      )}
      {nextPage ? (
        <Link 
          href={nextPage.href}
          className="border border-[#ff8c00] text-[#ff8c00] rounded-lg p-4 hover:bg-[#ff8c00] hover:text-black transition font-mono text-center"
        >
          {nextPage.label} →
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
