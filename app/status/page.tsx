import StatusClient from './StatusClient'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Uptime',
  description: 'Real-time availability monitoring for homelab.eurusik.tech. View uptime statistics, response times, and service health status.',
  path: '/status',
  keywords: ['uptime', 'monitoring', 'status', 'availability', 'performance', 'uptimerobot'],
})

export default function StatusPage() {
  return <StatusClient />
}
