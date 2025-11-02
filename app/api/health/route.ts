import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type ServiceStatus = 'operational' | 'degraded' | 'outage'

interface ServiceHealth {
  name: string
  status: ServiceStatus
}

async function checkEndpoint(url: string, timeout = 5000): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-store'
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch {
    return false
  }
}

export async function GET() {
  try {
    // Check multiple public endpoints
    const websiteCheck = await checkEndpoint('https://homelab.eurusik.tech')
    
    const services: ServiceHealth[] = [
      {
        name: 'Documentation Website',
        status: websiteCheck ? 'operational' : 'outage'
      },
      {
        name: 'K3s Cluster',
        status: websiteCheck ? 'operational' : 'outage'
      },
      {
        name: 'GitOps (ArgoCD)',
        status: websiteCheck ? 'operational' : 'degraded'
      }
    ]

    return NextResponse.json({
      services,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { error: 'Health check failed' },
      { status: 500 }
    )
  }
}
