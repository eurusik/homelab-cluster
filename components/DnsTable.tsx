interface DnsTableRow {
  alias: string
  targetIp: string
  purpose: string
}

interface DnsTableProps {
  rows: DnsTableRow[]
}

export default function DnsTable({ rows }: DnsTableProps) {
  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2a2a2a]">
            <th className="text-left px-6 py-4 font-mono text-sm text-gray-400 font-semibold">Alias</th>
            <th className="text-left px-6 py-4 font-mono text-sm text-gray-400 font-semibold">Target IP</th>
            <th className="text-left px-6 py-4 font-mono text-sm text-gray-400 font-semibold">Purpose</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr 
              key={index} 
              className={`${index !== rows.length - 1 ? 'border-b border-[#2a2a2a]' : ''} hover:bg-[#1a1a1a] transition`}
            >
              <td className="px-6 py-4 font-mono text-sm text-white font-semibold">{row.alias}</td>
              <td className="px-6 py-4 font-mono text-sm text-gray-300">{row.targetIp}</td>
              <td className="px-6 py-4 font-mono text-sm text-gray-400">{row.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
