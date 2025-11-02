'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    const renderChart = async () => {
      mermaid.initialize({
        startOnLoad: false,
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

      try {
        const { svg } = await mermaid.render('mermaid-diagram', chart)
        setSvg(svg)
      } catch (error) {
        console.error('Mermaid rendering error:', error)
      }
    }

    renderChart()
  }, [chart])

  return (
    <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-6 overflow-x-auto">
      <div 
        ref={chartRef} 
        className="flex justify-center"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  )
}
