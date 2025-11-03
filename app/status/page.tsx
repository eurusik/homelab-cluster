import StatusClient from './StatusClient'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Uptime',
  description: 'Real-time availability monitoring for homelab.eurusik.tech. View uptime statistics, response times, and service health status.',
  path: '/status',
  keywords: ['uptime', 'monitoring', 'status', 'availability', 'performance', 'uptimerobot'],
})

interface Service {
  name: string
  description: string
  status: 'operational' | 'degraded' | 'outage'
  url?: string
  interval?: number
  uptime?: {
    day: string
    week: string
    month: string
    twoMonths: string
    threeMonths: string
  }
  responseTime?: number
  responseTimeChart?: Array<{
    time: string
    value: number
  }>
  incidents?: Array<{
    date: string
    duration: number
    reason: string
  }>
}

async function getUptimeData(): Promise<Service[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/uptime`, {
      next: { revalidate: 30 } // Revalidate every 30 seconds
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch uptime data')
    }
    
    const data = await response.json()
    
    // Add descriptions and URLs to services
    const services = (data.services || []).map((s: any) => ({
      ...s,
      description: getServiceDescription(s.name),
      url: s.url || getServiceUrl(s.name)
    }))
    
    return services
  } catch (error) {
    console.error('Failed to fetch uptime data:', error)
    return []
  }
}

function getServiceDescription(name: string) {
  const descriptions: Record<string, string> = {
    'homelab.eurusik.tech/': 'Documentation Website'
  }
  return descriptions[name] || 'Service'
}

function getServiceUrl(name: string) {
  const urls: Record<string, string> = {
    'Documentation Website': 'https://homelab.eurusik.tech'
  }
  return urls[name]
}

export default async function StatusPage() {
  const initialServices = await getUptimeData()
  
  return <StatusClient initialServices={initialServices} />
}
