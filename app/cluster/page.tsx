import { generateMetadata } from '@/lib/metadata'
import ClusterClient from './ClusterClient'

interface MetricsResponse {
  nodes: Array<{
    node: string
    cpuUsage: number
    memoryUsage: number
    memoryTotal: number
    memoryUsed: number
    timestamp: number
  }>
  error?: string
  fallback?: boolean
}

export const metadata = generateMetadata({
  title: 'Cluster Metrics',
  description: 'Real-time monitoring of K3s cluster nodes. View CPU usage, memory consumption, and performance metrics for RpiMaster, RpiWorker1, and RpiWorker2.',
  path: '/cluster',
  keywords: ['cluster', 'metrics', 'monitoring', 'prometheus', 'cpu', 'memory', 'kubernetes', 'k3s'],
})

export const revalidate = 10 // Revalidate every 10 seconds

async function getInitialMetrics(): Promise<MetricsResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/metrics`, {
      cache: 'no-store',
      next: { revalidate: 10 }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch metrics')
    }
    
    return await response.json()
  } catch (error) {
    console.error('SSR metrics fetch failed:', error)
    // Return empty response, client will fetch
    return { nodes: [] }
  }
}

export default async function ClusterPage() {
  const initialData = await getInitialMetrics()
  
  return <ClusterClient initialData={initialData} />
}
