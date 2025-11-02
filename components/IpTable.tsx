interface IpTableRow {
  device: string
  role: string
  ipv4: string
}

interface IpTableProps {
  rows: IpTableRow[]
}

export default function IpTable({ rows }: IpTableProps) {
  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2a2a2a]">
            <th className="text-left px-6 py-4 font-mono text-sm text-gray-400 font-semibold">Device</th>
            <th className="text-left px-6 py-4 font-mono text-sm text-gray-400 font-semibold">Role</th>
            <th className="text-left px-6 py-4 font-mono text-sm text-gray-400 font-semibold">IPv4 Address</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr 
              key={index} 
              className={`${index !== rows.length - 1 ? 'border-b border-[#2a2a2a]' : ''} hover:bg-[#1a1a1a] transition`}
            >
              <td className="px-6 py-4 font-mono text-sm text-gray-300">{row.device}</td>
              <td className="px-6 py-4 font-mono text-sm text-gray-400">{row.role}</td>
              <td className="px-6 py-4 font-mono text-sm text-white font-semibold">{row.ipv4}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
