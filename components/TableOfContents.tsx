'use client'

import { useEffect, useState } from 'react'

interface TocSection {
  id: string
  label: string
}

interface TableOfContentsProps {
  sections: TocSection[]
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -80% 0px' }
    )

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <aside className="hidden xl:block w-64 py-12 pr-8 sticky top-0 h-screen overflow-y-auto">
      <div className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-mono flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        On this page
      </div>
      <nav className="space-y-2">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`block text-sm font-mono transition ${
              activeSection === section.id ? 'text-[#ff8c00]' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {section.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
