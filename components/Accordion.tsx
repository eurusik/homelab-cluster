'use client'

import { useState, ReactNode } from 'react'
import CollapsibleSection from '@/components/CollapsibleSection'

export interface AccordionItem {
  id: string
  title: string
  icon: ReactNode
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
}

export default function Accordion({ items }: AccordionProps) {
  const [openSections, setOpenSections] = useState<string[]>([])

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  return (
    <>
      {items.map((item) => (
        <CollapsibleSection
          key={item.id}
          id={item.id}
          title={item.title}
          isOpen={openSections.includes(item.id)}
          onToggle={() => toggleSection(item.id)}
          icon={item.icon}
        >
          {item.content}
        </CollapsibleSection>
      ))}
    </>
  )
}
