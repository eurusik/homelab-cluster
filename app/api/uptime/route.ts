import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface UptimeRobotMonitor {
  id: number
  friendly_name: string
  url: string
  status: number // 0=paused, 1=not checked, 2=up, 8=seems down, 9=down
  custom_uptime_ratio: string
  average_response_time: number
}

interface UptimeRobotResponse {
  stat: string
  monitors: UptimeRobotMonitor[]
}

export async function GET() {
  const apiKey = process.env.UPTIMEROBOT_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { 
        error: 'UptimeRobot API key not configured',
        fallback: true,
        services: [
          { name: 'Documentation Website', status: 'operational', uptime: 'N/A' },
          { name: 'K3s Cluster', status: 'operational', uptime: 'N/A' },
          { name: 'GitOps (ArgoCD)', status: 'operational', uptime: 'N/A' },
        ]
      },
      { status: 200 }
    )
  }

  try {
    const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        api_key: apiKey,
        format: 'json',
        custom_uptime_ratios: '30', // Last 30 days
        response_times: '1',
        response_times_average: '30'
      }),
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`UptimeRobot API error: ${response.status}`)
    }

    const data: UptimeRobotResponse = await response.json()

    if (data.stat !== 'ok') {
      throw new Error('UptimeRobot API returned error status')
    }

    const services = data.monitors.map(monitor => {
      // Map UptimeRobot status to our status
      let status: 'operational' | 'degraded' | 'outage'
      if (monitor.status === 2) {
        status = 'operational'
      } else if (monitor.status === 8) {
        status = 'degraded'
      } else {
        status = 'outage'
      }

      return {
        name: monitor.friendly_name,
        status,
        uptime: `${monitor.custom_uptime_ratio}%`,
        responseTime: monitor.average_response_time,
        url: monitor.url
      }
    })

    return NextResponse.json({
      services,
      timestamp: new Date().toISOString(),
      source: 'uptimerobot'
    })

  } catch (error) {
    console.error('UptimeRobot fetch error:', error)
    
    // Fallback to basic health check
    return NextResponse.json(
      {
        error: 'Failed to fetch from UptimeRobot',
        fallback: true,
        services: [
          { name: 'Documentation Website', status: 'operational', uptime: 'N/A' },
          { name: 'K3s Cluster', status: 'operational', uptime: 'N/A' },
          { name: 'GitOps (ArgoCD)', status: 'operational', uptime: 'N/A' },
        ]
      },
      { status: 200 }
    )
  }
}
