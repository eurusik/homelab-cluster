import Table from './Table'

interface IpTableRow {
  device: string
  role: string
  ipv4: string
}

interface IpTableProps {
  rows: IpTableRow[]
}

export default function IpTable({ rows }: IpTableProps) {
  const columns = [
    { key: 'device', label: 'Device' },
    { key: 'role', label: 'Role' },
    { key: 'ipv4', label: 'IPv4 Address' },
  ]

  const tableRows = rows.map(row => ({
    device: <span className="text-gray-300">{row.device}</span>,
    role: <span className="text-gray-400">{row.role}</span>,
    ipv4: <span className="text-white font-semibold">{row.ipv4}</span>,
  }))

  return <Table columns={columns} rows={tableRows} />
}
