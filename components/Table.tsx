interface TableColumn {
  key: string
  label: string
  className?: string
}

interface TableRow {
  [key: string]: string | number | React.ReactNode
  className?: string
}

interface TableProps {
  columns: TableColumn[]
  rows: TableRow[]
}

export default function Table({ columns, rows }: TableProps) {
  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#ff8c00] scrollbar-track-[#1a1a1a]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left px-2 sm:px-4 lg:px-6 py-3 sm:py-4 font-mono text-xs sm:text-sm text-gray-400 font-semibold whitespace-nowrap ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className={`${
                  index !== rows.length - 1 ? 'border-b border-[#2a2a2a]' : ''
                } hover:bg-[#1a1a1a] transition ${row.className || ''}`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 font-mono text-xs sm:text-sm whitespace-nowrap"
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
