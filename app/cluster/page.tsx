import { generateMetadata } from '@/lib/metadata'
import ClusterClient from './ClusterClient'

export const metadata = generateMetadata({
  title: 'Cluster Metrics',
  description: 'Real-time monitoring of K3s cluster nodes. View CPU usage, memory consumption, and performance metrics for RpiMaster, RpiWorker1, and RpiWorker2.',
  path: '/cluster',
  keywords: ['cluster', 'metrics', 'monitoring', 'prometheus', 'cpu', 'memory', 'kubernetes', 'k3s'],
})

export default function ClusterPage() {
  return <ClusterClient />
}
