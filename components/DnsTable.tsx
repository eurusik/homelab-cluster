import Table from './Table'

interface DnsTableRow {
  alias: string
  targetIp: string
  purpose: string
}

interface DnsTableProps {
  rows: DnsTableRow[]
}

export default function DnsTable({ rows }: DnsTableProps) {
  const columns = [
    { key: 'alias', label: 'Alias' },
    { key: 'targetIp', label: 'Target IP' },
    { key: 'purpose', label: 'Purpose' },
  ]

  const tableRows = rows.map(row => ({
    alias: <span className="text-white font-semibold">{row.alias}</span>,
    targetIp: <span className="text-gray-300">{row.targetIp}</span>,
    purpose: <span className="text-gray-400">{row.purpose}</span>,
  }))

  return <Table columns={columns} rows={tableRows} />
}
