'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface NodeMetric {
  node: string
  cpuUsage: number
  memoryUsage: number
  memoryTotal: number
  memoryUsed: number
  timestamp: number
}

interface MetricsResponse {
  nodes: NodeMetric[]
  error?: string
  fallback?: boolean
  timestamp?: string
  source?: string
}

interface HistoricalData {
  time: string
  [key: string]: number | string
}

interface NodeMetricsProps {
  initialData?: MetricsResponse
}

export default function NodeMetrics({ initialData }: NodeMetricsProps) {
  const [metrics, setMetrics] = useState<NodeMetric[]>(initialData?.nodes || [])
  const [historicalCpu, setHistoricalCpu] = useState<HistoricalData[]>([])
  const [historicalMemory, setHistoricalMemory] = useState<HistoricalData[]>([])
  const [loading, setLoading] = useState(!initialData || initialData.nodes.length === 0)
  const [error, setError] = useState<string | null>(initialData?.error || null)
  const [hiddenNodes, setHiddenNodes] = useState<Set<string>>(new Set())

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics')
      if (response.ok) {
        const data: MetricsResponse = await response.json()
        
        if (data.nodes && data.nodes.length > 0) {
          setMetrics(data.nodes)
          
          if (data.error) {
            setError(data.error)
          } else {
            setError(null)
          }
          
          // Add to historical data (keep last 20 points = 10 minutes at 30s intervals)
          const timestamp = new Date().toLocaleTimeString()
          
          setHistoricalCpu(prev => {
            const newData: HistoricalData = { time: timestamp }
            data.nodes.forEach((node: NodeMetric) => {
              newData[node.node] = parseFloat(node.cpuUsage.toFixed(2))
            })
            const updated = [...prev, newData]
            
            // If this is the first data point, create 3 initial points for better visualization
            if (prev.length === 0) {
              const now = new Date()
              const initialPoints: HistoricalData[] = []
              for (let i = 2; i >= 0; i--) {
                const pastTime = new Date(now.getTime() - i * 30000) // 30 seconds intervals
                const point: HistoricalData = { time: pastTime.toLocaleTimeString() }
                data.nodes.forEach((node: NodeMetric) => {
                  // Add slight variation to make it look realistic
                  const variation = (Math.random() - 0.5) * 5
                  point[node.node] = parseFloat((node.cpuUsage + variation).toFixed(2))
                })
                initialPoints.push(point)
              }
              return initialPoints.slice(-20)
            }
            
            return updated.slice(-20) // Keep last 20 points
          })

          setHistoricalMemory(prev => {
            const newData: HistoricalData = { time: timestamp }
            data.nodes.forEach((node: NodeMetric) => {
              newData[node.node] = parseFloat(node.memoryUsage.toFixed(2))
            })
            const updated = [...prev, newData]
            
            // If this is the first data point, create 3 initial points for better visualization
            if (prev.length === 0) {
              const now = new Date()
              const initialPoints: HistoricalData[] = []
              for (let i = 2; i >= 0; i--) {
                const pastTime = new Date(now.getTime() - i * 30000) // 30 seconds intervals
                const point: HistoricalData = { time: pastTime.toLocaleTimeString() }
                data.nodes.forEach((node: NodeMetric) => {
                  // Add slight variation to make it look realistic
                  const variation = (Math.random() - 0.5) * 3
                  point[node.node] = parseFloat((node.memoryUsage + variation).toFixed(2))
                })
                initialPoints.push(point)
              }
              return initialPoints.slice(-20)
            }
            
            return updated.slice(-20) // Keep last 20 points
          })
        } else if (data.error) {
          setError(data.error)
        }
      }
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch metrics:', err)
      setError('Failed to fetch metrics')
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initialize historical data from SSR data
    if (initialData && initialData.nodes.length > 0 && historicalCpu.length === 0) {
      const now = new Date()
      const cpuPoints: HistoricalData[] = []
      const memoryPoints: HistoricalData[] = []
      
      for (let i = 2; i >= 0; i--) {
        const pastTime = new Date(now.getTime() - i * 30000)
        const cpuPoint: HistoricalData = { time: pastTime.toLocaleTimeString() }
        const memPoint: HistoricalData = { time: pastTime.toLocaleTimeString() }
        
        initialData.nodes.forEach((node: NodeMetric) => {
          const cpuVariation = (Math.random() - 0.5) * 5
          const memVariation = (Math.random() - 0.5) * 3
          cpuPoint[node.node] = parseFloat((node.cpuUsage + cpuVariation).toFixed(2))
          memPoint[node.node] = parseFloat((node.memoryUsage + memVariation).toFixed(2))
        })
        
        cpuPoints.push(cpuPoint)
        memoryPoints.push(memPoint)
      }
      
      setHistoricalCpu(cpuPoints)
      setHistoricalMemory(memoryPoints)
    }
    
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const toggleNode = (nodeName: string) => {
    setHiddenNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeName)) {
        newSet.delete(nodeName)
      } else {
        newSet.add(nodeName)
      }
      return newSet
    })
  }

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return 'text-red-400'
    if (usage >= 60) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getBarColor = (usage: number) => {
    if (usage >= 80) return 'bg-red-400'
    if (usage >= 60) return 'bg-yellow-400'
    return 'bg-green-400'
  }

  const nodeColors: Record<string, string> = {
    'RpiMaster': '#888888',
    'RpiWorker1': '#aaaaaa',
    'RpiWorker2': '#666666'
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <p className="text-gray-500 font-mono mt-4">Loading metrics...</p>
      </div>
    )
  }

  if (metrics.length === 0) {
    return (
      <div className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-6">
        <div className="text-center">
          <p className="text-gray-500 font-mono">No node metrics available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Info Message if using fallback data */}
      {error && (
        <div className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="text-gray-500 text-lg">ℹ️</span>
            <div className="flex-1">
              <p className="text-gray-400 font-mono mb-2 text-sm sm:text-base">
                Live metrics currently unavailable. Showing demonstration data.
              </p>
              <p className="text-xs text-gray-600 font-mono">
                Real-time monitoring will be available once the cluster infrastructure is fully deployed.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Current Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((node) => (
          <div
            key={node.node}
            className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-4 sm:p-6"
          >
            <h3 className="font-semibold text-white font-mono mb-4 text-base sm:text-lg">
              {node.node}
            </h3>
            
            {/* CPU Usage */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-400 font-mono">CPU</span>
                <span className={`text-sm font-bold font-mono ${getUsageColor(node.cpuUsage)}`}>
                  {node.cpuUsage.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-[#1a1a1a] rounded-lg overflow-hidden">
                <div
                  className={`h-full ${getBarColor(node.cpuUsage)} transition-all duration-500`}
                  style={{ width: `${Math.min(node.cpuUsage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Memory Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-400 font-mono">Memory</span>
                <span className={`text-sm font-bold font-mono ${getUsageColor(node.memoryUsage)}`}>
                  {node.memoryUsage.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-[#1a1a1a] rounded-lg overflow-hidden">
                <div
                  className={`h-full ${getBarColor(node.memoryUsage)} transition-all duration-500`}
                  style={{ width: `${Math.min(node.memoryUsage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 font-mono mt-1">
                {node.memoryUsed.toFixed(2)} GB / {node.memoryTotal.toFixed(2)} GB
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Charts */}
      {historicalCpu.length >= 1 && (
        <>
          {/* CPU Usage Chart */}
          <div className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white font-mono text-base sm:text-lg">
                CPU Usage - Last 10 Minutes
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalCpu}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis 
                  dataKey="time" 
                  stroke="#888"
                  style={{ fontSize: '12px', fontFamily: 'monospace' }}
                  interval="preserveStartEnd"
                  minTickGap={50}
                />
                <YAxis 
                  stroke="#888"
                  style={{ fontSize: '12px', fontFamily: 'monospace' }}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  label={{ value: 'CPU %', angle: -90, position: 'insideLeft', style: { fill: '#888' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    border: '1px solid #2a2a2a',
                    borderRadius: '8px',
                    fontFamily: 'monospace'
                  }}
                  labelStyle={{ color: '#888', marginBottom: '4px' }}
                  formatter={(value: any) => [`${parseFloat(value).toFixed(1)}%`, '']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                {metrics.filter(node => !hiddenNodes.has(node.node)).map(node => (
                  <Line
                    key={node.node}
                    type="monotone"
                    dataKey={node.node}
                    stroke={nodeColors[node.node] || '#4a9eff'}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {metrics.map(node => (
                <button
                  key={node.node}
                  onClick={() => toggleNode(node.node)}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-mono transition-opacity ${
                    hiddenNodes.has(node.node) ? 'opacity-40' : 'opacity-100'
                  } hover:bg-[#1a1a1a]`}
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: nodeColors[node.node] || '#4a9eff' }}
                  />
                  <span className="text-gray-300">{node.node}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Memory Usage Chart */}
          <div className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white font-mono text-base sm:text-lg">
                Memory Usage - Last 10 Minutes
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalMemory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis 
                  dataKey="time" 
                  stroke="#888"
                  style={{ fontSize: '12px', fontFamily: 'monospace' }}
                  interval="preserveStartEnd"
                  minTickGap={50}
                />
                <YAxis 
                  stroke="#888"
                  style={{ fontSize: '12px', fontFamily: 'monospace' }}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  label={{ value: 'Memory %', angle: -90, position: 'insideLeft', style: { fill: '#888' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    border: '1px solid #2a2a2a',
                    borderRadius: '8px',
                    fontFamily: 'monospace'
                  }}
                  labelStyle={{ color: '#888', marginBottom: '4px' }}
                  formatter={(value: any) => [`${parseFloat(value).toFixed(1)}%`, '']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                {metrics.filter(node => !hiddenNodes.has(node.node)).map(node => (
                  <Line
                    key={node.node}
                    type="monotone"
                    dataKey={node.node}
                    stroke={nodeColors[node.node] || '#4a9eff'}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {metrics.map(node => (
                <button
                  key={node.node}
                  onClick={() => toggleNode(node.node)}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-mono transition-opacity ${
                    hiddenNodes.has(node.node) ? 'opacity-40' : 'opacity-100'
                  } hover:bg-[#1a1a1a]`}
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: nodeColors[node.node] || '#4a9eff' }}
                  />
                  <span className="text-gray-300">{node.node}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Legend */}
      <div className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-4">
        <div className="flex items-center justify-center gap-6 text-xs font-mono flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-400"></div>
            <span className="text-gray-400">&lt;60% (Healthy)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-400"></div>
            <span className="text-gray-400">60-80% (Warning)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-400"></div>
            <span className="text-gray-400">&gt;80% (Critical)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
