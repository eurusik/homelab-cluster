'use client'

import { useState } from 'react'

interface CodeBlockProps {
  code: string
}

export default function CodeBlock({ code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple syntax highlighting for bash/shell commands
  const highlightCode = (code: string) => {
    // Split by lines
    const lines = code.split('\n')
    
    return lines.map((line, lineIndex) => {
      // Highlight parameters in angle brackets <...>
      const parts = line.split(/(<[^>]+>)/g)
      
      return (
        <div key={lineIndex}>
          {parts.map((part, partIndex) => {
            // Angle bracket parameters - orange
            if (part.startsWith('<') && part.endsWith('>')) {
              return <span key={partIndex} className="text-[#d4976c]">{part}</span>
            }
            // Strings in quotes - orange
            else if (part.match(/"[^"]+"/)) {
              return <span key={partIndex} className="text-[#d4976c]">{part}</span>
            }
            // Keywords like manual - orange
            else if (part.match(/\b(manual|static|dynamic)\b/)) {
              return <span key={partIndex} className="text-[#d4976c]">{part}</span>
            }
            // Default - light gray/white
            else {
              return <span key={partIndex} className="text-gray-300">{part}</span>
            }
          })}
        </div>
      )
    })
  }

  return (
    <div className="relative bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg overflow-hidden w-full max-w-full">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-3 p-1.5 sm:p-2 hover:bg-[#2a2a2a] rounded transition-colors group z-10"
        aria-label="Copy code"
      >
        {copied ? (
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#4aff4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>

      {/* Code content */}
      <div className="p-3 pr-10 sm:p-4 sm:pr-14 font-mono text-xs sm:text-sm overflow-x-auto scrollbar-thin scrollbar-thumb-[#ff8c00] scrollbar-track-[#1a1a1a]">
        <pre className="whitespace-pre">{highlightCode(code)}</pre>
      </div>
    </div>
  )
}
