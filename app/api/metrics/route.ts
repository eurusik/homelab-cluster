import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 10 // Cache for 10 seconds

interface PrometheusMetric {
  metric: {
    instance?: string
    node?: string
    [key: string]: string | undefined
  }
  value: [number, string]
}

interface PrometheusResponse {
  status: string
  data: {
    resultType: string
    result: PrometheusMetric[]
  }
}

interface NodeMetrics {
  node: string
  cpuUsage: number
  memoryUsage: number
  memoryTotal: number
  memoryUsed: number
  timestamp: number
}

export async function GET() {
  const prometheusUrl = process.env.PROMETHEUS_URL

  if (!prometheusUrl) {
    console.log('PROMETHEUS_URL not configured, using fallback data')
    return NextResponse.json(
      { 
        error: 'Monitoring system not configured',
        fallback: true,
        nodes: getFallbackData()
      },
      { status: 200 }
    )
  }

  try {
    const now = Math.floor(Date.now() / 1000)

    // Fetch CPU usage (percentage of total)
    // Query: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
    const cpuQuery = encodeURIComponent(
      '100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)'
    )

    // Fetch memory usage (percentage)
    // Query: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
    const memoryQuery = encodeURIComponent(
      '(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100'
    )

    // Fetch total memory
    const memoryTotalQuery = encodeURIComponent('node_memory_MemTotal_bytes')

    // Fetch available memory
    const memoryAvailableQuery = encodeURIComponent('node_memory_MemAvailable_bytes')

    const [cpuResponse, memoryResponse, memoryTotalResponse, memoryAvailableResponse] = await Promise.all([
      fetch(`${prometheusUrl}/api/v1/query?query=${cpuQuery}&time=${now}`, {
        cache: 'no-store'
      }),
      fetch(`${prometheusUrl}/api/v1/query?query=${memoryQuery}&time=${now}`, {
        cache: 'no-store'
      }),
      fetch(`${prometheusUrl}/api/v1/query?query=${memoryTotalQuery}&time=${now}`, {
        cache: 'no-store'
      }),
      fetch(`${prometheusUrl}/api/v1/query?query=${memoryAvailableQuery}&time=${now}`, {
        cache: 'no-store'
      })
    ])

    if (!cpuResponse.ok || !memoryResponse.ok) {
      throw new Error('Failed to fetch metrics from Prometheus')
    }

    const cpuData: PrometheusResponse = await cpuResponse.json()
    const memoryData: PrometheusResponse = await memoryResponse.json()
    const memoryTotalData: PrometheusResponse = await memoryTotalResponse.json()
    const memoryAvailableData: PrometheusResponse = await memoryAvailableResponse.json()

    // Build a map of node metrics
    const nodeMetricsMap = new Map<string, Partial<NodeMetrics>>()

    // Process CPU data
    cpuData.data.result.forEach(item => {
      const instance = item.metric.instance || 'unknown'
      const nodeName = extractNodeName(instance)
      const cpuUsage = parseFloat(item.value[1])

      if (!nodeMetricsMap.has(nodeName)) {
        nodeMetricsMap.set(nodeName, {})
      }
      const metrics = nodeMetricsMap.get(nodeName)!
      metrics.node = nodeName
      metrics.cpuUsage = cpuUsage
      metrics.timestamp = Date.now()
    })

    // Process memory usage data
    memoryData.data.result.forEach(item => {
      const instance = item.metric.instance || 'unknown'
      const nodeName = extractNodeName(instance)
      const memoryUsage = parseFloat(item.value[1])

      if (!nodeMetricsMap.has(nodeName)) {
        nodeMetricsMap.set(nodeName, {})
      }
      const metrics = nodeMetricsMap.get(nodeName)!
      metrics.memoryUsage = memoryUsage
    })

    // Process memory total data
    memoryTotalData.data.result.forEach(item => {
      const instance = item.metric.instance || 'unknown'
      const nodeName = extractNodeName(instance)
      const memoryTotal = parseFloat(item.value[1]) / (1024 ** 3) // Convert to GB

      if (!nodeMetricsMap.has(nodeName)) {
        nodeMetricsMap.set(nodeName, {})
      }
      const metrics = nodeMetricsMap.get(nodeName)!
      metrics.memoryTotal = memoryTotal
    })

    // Process memory available data
    memoryAvailableData.data.result.forEach(item => {
      const instance = item.metric.instance || 'unknown'
      const nodeName = extractNodeName(instance)
      const memoryAvailable = parseFloat(item.value[1]) / (1024 ** 3) // Convert to GB

      if (!nodeMetricsMap.has(nodeName)) {
        nodeMetricsMap.set(nodeName, {})
      }
      const metrics = nodeMetricsMap.get(nodeName)!
      if (metrics.memoryTotal) {
        metrics.memoryUsed = metrics.memoryTotal - memoryAvailable
      }
    })

    // Convert map to array and filter out empty node names
    const nodes: NodeMetrics[] = Array.from(nodeMetricsMap.values())
      .filter(m => m.node && m.node !== '')
      .map(m => ({
        node: m.node || 'unknown',
        cpuUsage: m.cpuUsage || 0,
        memoryUsage: m.memoryUsage || 0,
        memoryTotal: m.memoryTotal || 0,
        memoryUsed: m.memoryUsed || 0,
        timestamp: m.timestamp || Date.now()
      }))

    return NextResponse.json({
      nodes,
      timestamp: new Date().toISOString(),
      source: 'prometheus'
    })

  } catch (error) {
    console.error('Prometheus fetch error:', error)
    
    // Fallback data
    return NextResponse.json(
      {
        error: 'Unable to fetch live metrics',
        fallback: true,
        nodes: getFallbackData()
      },
      { status: 200 }
    )
  }
}

function getFallbackData(): NodeMetrics[] {
  // Return sample data with slight variation for development/testing
  // This simulates realistic fluctuating metrics
  const baseValues = {
    RpiMaster: { cpu: 25, memory: 45, total: 8.0 },
    RpiWorker1: { cpu: 20, memory: 40, total: 4.0 },
    RpiWorker2: { cpu: 35, memory: 55, total: 8.0 }
  }

  return Object.entries(baseValues).map(([node, base]) => {
    // Add random variation: ±5% for CPU, ±3% for memory
    const cpuVariation = (Math.random() - 0.5) * 10
    const memoryVariation = (Math.random() - 0.5) * 6
    
    const cpuUsage = Math.max(5, Math.min(95, base.cpu + cpuVariation))
    const memoryUsage = Math.max(10, Math.min(90, base.memory + memoryVariation))
    const memoryUsed = (memoryUsage / 100) * base.total

    return {
      node,
      cpuUsage: parseFloat(cpuUsage.toFixed(2)),
      memoryUsage: parseFloat(memoryUsage.toFixed(2)),
      memoryTotal: base.total,
      memoryUsed: parseFloat(memoryUsed.toFixed(2)),
      timestamp: Date.now()
    }
  })
}

function extractNodeName(instance: string): string {
  // Extract node name from instance string (e.g., "192.168.88.5:9100" -> "192.168.88.5")
  const ip = instance.split(':')[0]
  
  // Skip service DNS names
  if (ip.includes('.svc.cluster.local') || ip.includes('node-exporter')) {
    return '' // Will be filtered out
  }
  
  // Map IPs to friendly names based on your network configuration
  const nodeNames: Record<string, string> = {
    '192.168.88.5': 'RpiMaster',
    '192.168.88.6': 'RpiWorker1',
    '192.168.88.7': 'RpiWorker2'
  }

  return nodeNames[ip] || ''
}
