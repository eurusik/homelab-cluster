'use client'

import { ReactNode } from 'react'

interface CollapsibleSectionProps {
  id: string
  title: string
  icon: ReactNode
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}

export default function CollapsibleSection({
  id,
  title,
  icon,
  isOpen,
  onToggle,
  children
}: CollapsibleSectionProps) {
  return (
    <div className="mb-4 border border-[#2a2a2a] rounded-lg bg-[#111111]">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-[#1a1a1a] transition cursor-pointer"
      >
        <svg 
          className="w-5 h-5 text-gray-400 transition-transform" 
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="flex-shrink-0">{icon}</span>
        <span className="font-semibold text-white font-mono">{title}</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  )
}
