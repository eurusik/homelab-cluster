'use client'

import { Children, useRef, useEffect, useState } from 'react'

interface TimelineGroupProps {
  children: React.ReactNode
}

export default function TimelineGroup({ children }: TimelineGroupProps) {
  const childrenArray = Children.toArray(children)
  const stepCount = childrenArray.length
  const containerRef = useRef<HTMLDivElement>(null)
  const [lineHeight, setLineHeight] = useState('0px')
  
  useEffect(() => {
    if (containerRef.current && stepCount > 1) {
      // Find all step badges
      const badges = containerRef.current.querySelectorAll('.timeline-step-container')
      if (badges.length > 1) {
        const lastBadge = badges[badges.length - 1] as HTMLElement
        const containerTop = containerRef.current.getBoundingClientRect().top
        const lastBadgeTop = lastBadge.getBoundingClientRect().top
        const height = lastBadgeTop - containerTop
        setLineHeight(`${height}px`)
      }
    }
  }, [stepCount, children])
  
  return (
    <div className="relative" ref={containerRef}>
      {/* Vertical line that goes exactly to the last badge */}
      {stepCount > 1 && lineHeight !== '0px' && (
        <div 
          className="absolute left-4 top-0 w-0.5 bg-[#2a2a2a]"
          style={{ height: lineHeight }}
        />
      )}
      
      {/* Steps content */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}
