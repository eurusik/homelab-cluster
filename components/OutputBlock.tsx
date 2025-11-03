interface OutputBlockProps {
  output: string
  language?: string
}

export default function OutputBlock({ output, language = 'shell' }: OutputBlockProps) {
  return (
    <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto scrollbar-thin scrollbar-thumb-[#ff8c00] scrollbar-track-[#1a1a1a] w-full max-w-full">
      <pre className="text-gray-300 whitespace-pre">{output}</pre>
    </div>
  )
}
