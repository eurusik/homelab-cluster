'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface NetworkDiagramProps {
  chart: string
}

export default function NetworkDiagram({ chart }: NetworkDiagramProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#ff8c00',
        primaryTextColor: '#e0e0e0',
        primaryBorderColor: '#ff8c00',
        lineColor: '#4a4a4a',
        secondaryColor: '#1a1a1a',
        tertiaryColor: '#0a0a0a',
        fontSize: '14px',
        fontFamily: 'Courier New, monospace',
      },
    })

    if (chartRef.current) {
      chartRef.current.innerHTML = chart
      mermaid.contentLoaded()
    }
  }, [chart])

  return (
    <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-6 overflow-x-auto">
      <div ref={chartRef} className="mermaid flex justify-center" />
    </div>
  )
}
