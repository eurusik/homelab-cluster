import { ReactNode } from 'react'

interface InfoBlockProps {
  children: ReactNode
}

export default function InfoBlock({ children }: InfoBlockProps) {
  return (
    <div className="p-6 bg-sky-500/10 border border-sky-500/30 rounded-lg overflow-hidden">
      <div className="flex items-start gap-3">
        <svg 
          className="w-6 h-6 text-sky-400 flex-shrink-0 mt-0.5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
            clipRule="evenodd" 
          />
        </svg>
        <div className="text-sm text-sky-100 font-mono leading-relaxed break-words min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
