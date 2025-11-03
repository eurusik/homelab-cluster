'use client'

interface TimelineStepProps {
  stepNumber: number
  title: string
  children: React.ReactNode
}

export default function TimelineStep({ stepNumber, title, children }: TimelineStepProps) {
  return (
    <div className="timeline-step-container flex items-start gap-3 sm:gap-4 pb-6 sm:pb-8 relative w-full max-w-full">
      {/* Badge only - line is drawn by TimelineGroup */}
      <div className="relative flex-shrink-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#2a2a2a] border border-[#ff8c00] rounded flex items-center justify-center relative z-10">
          <span className="text-[#ff8c00] font-mono font-bold text-sm sm:text-base">{stepNumber}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 w-0">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white font-mono mb-2 sm:mb-3 break-words">{title}</h3>
        {children}
      </div>
    </div>
  )
}
