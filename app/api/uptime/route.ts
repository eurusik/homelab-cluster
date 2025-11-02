import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface UptimeRobotMonitor {
  id: number
  friendly_name: string
  url: string
  status: number // 0=paused, 1=not checked, 2=up, 8=seems down, 9=down
  interval: number // Check interval in seconds
  custom_uptime_ratio: string
  custom_uptime_ranges: string
  average_response_time: number
  response_times?: Array<{
    datetime: number
    value: number
  }>
  logs?: Array<{
    type: number // 1=down, 2=up, 98=started, 99=paused
    datetime: number
    duration: number
    reason?: {
      code?: string
      detail?: string
    }
  }>
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
        custom_uptime_ratios: '1-7-30-60-90', // Last 1, 7, 30, 60, 90 days
        response_times: '1',
        response_times_average: '720', // Last 30 days (720 = 24*30)
        response_times_limit: '24', // Last 24 data points (24 hours)
        logs: '1',
        logs_limit: '10' // Last 10 incidents
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

      // Parse uptime ranges (1-7-30-60-90 days)
      // custom_uptime_ratio contains the values separated by dashes
      const uptimeRanges = monitor.custom_uptime_ratio?.split('-') || []
      
      // Parse response time chart data (last 24 hours)
      const responseTimeChart = (monitor.response_times || []).map(rt => ({
        time: new Date(rt.datetime * 1000).toISOString(),
        value: rt.value
      }))
      
      // Parse incidents from logs
      const incidents = (monitor.logs || [])
        .filter(log => log.type === 1) // Only down events
        .map(log => ({
          date: new Date(log.datetime * 1000).toISOString(),
          duration: log.duration,
          reason: log.reason?.detail || 'Connection timeout'
        }))
        .slice(0, 5) // Last 5 incidents

      return {
        name: monitor.friendly_name,
        status,
        interval: monitor.interval,
        uptime: {
          day: uptimeRanges[0] || '0.000',
          week: uptimeRanges[1] || '0.000',
          month: uptimeRanges[2] || '0.000',
          twoMonths: uptimeRanges[3] || '0.000',
          threeMonths: uptimeRanges[4] || '0.000'
        },
        responseTime: monitor.average_response_time,
        responseTimeChart,
        url: monitor.url,
        incidents
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
