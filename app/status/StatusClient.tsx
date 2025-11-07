'use client'

import { useEffect, useState } from 'react'

type ServiceStatus = 'operational' | 'degraded' | 'outage'

interface Service {
  name: string
  description: string
  status: ServiceStatus
  url?: string
  interval?: number
  uptime?: {
    day: string
    week: string
    month: string
    twoMonths: string
    threeMonths: string
  } | string
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

interface StatusClientProps {
  initialServices: Service[]
}

export default function StatusClient({ initialServices }: StatusClientProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [loading] = useState(false)

  const checkHealth = async () => {
    try {
      const response = await fetch('/api/uptime')
      if (response.ok) {
        const data = await response.json()
        
        if (data.services) {
          setServices(data.services.map((s: any) => ({
            ...s,
            description: s.description || getServiceDescription(s.name),
            url: s.url || getServiceUrl(s.name)
          })))
        }
      }
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Health check failed:', error)
    }
  }

  const getServiceDescription = (name: string) => {
    const descriptions: Record<string, string> = {
      'homelab.eurusik.tech': 'Documentation Website'
    }
    return descriptions[name] || 'Service'
  }

  const getServiceUrl = (name: string) => {
    const urls: Record<string, string> = {
      'Documentation Website': 'https://homelab.eurusik.tech'
    }
    return urls[name]
  }

  const getCheckInterval = (seconds?: number) => {
    if (!seconds) return 'Unknown'
    const minutes = seconds / 60
    if (minutes < 60) return `${minutes} min`
    const hours = minutes / 60
    return `${hours} hr`
  }

  useEffect(() => {
    if (initialServices.length === 0) {
      checkHealth()
    }
    
    const interval = setInterval(checkHealth, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusDot = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return 'bg-green-400'
      case 'degraded':
        return 'bg-yellow-400'
      case 'outage':
        return 'bg-red-400'
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white font-mono break-words">Uptime</h1>
        <p className="text-sm sm:text-base text-gray-400 font-mono">
          Real-time service availability
        </p>
      </div>

      {/* Services Status */}
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-white font-mono">Monitored Services</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <p className="text-gray-500 font-mono mt-4">Checking status...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-mono">No monitors configured</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
            <div
              key={service.name}
              className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-4 sm:p-6 hover:border-[#3a3a3a] transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  <span className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${getStatusDot(service.status)}`}></span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-white font-mono text-sm sm:text-base break-all">{service.name}</h3>
                      {service.url && (
                        <a
                          href={service.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 font-mono break-words">{service.description}</p>
                    {service.interval && (
                      <p className="text-xs text-gray-600 font-mono mt-1">
                        Checked every {getCheckInterval(service.interval)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <p className={`text-sm font-mono font-semibold ${
                    service.status === 'operational' ? 'text-green-400' :
                    service.status === 'degraded' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </p>
                  {service.uptime && (
                    <p className="text-xs text-gray-500 font-mono mt-1">
                      {typeof service.uptime === 'string' 
                        ? service.uptime 
                        : typeof service.uptime === 'object' && service.uptime.month
                          ? `${parseFloat(service.uptime.month).toFixed(2)}%`
                          : 'N/A'
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </section>

      {/* Uptime Stats */}
      {!loading && services.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-white font-mono">Historical Uptime</h2>
          <div className="grid gap-6">
            {services.filter(s => s.uptime).map((service) => {
              const uptime = service.uptime
              const hasDetailedUptime = typeof uptime === 'object' && uptime !== null
              
              if (!hasDetailedUptime) {
                return (
                  <div key={service.name} className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-6">
                    <p className="text-sm text-gray-500 font-mono mb-4">{service.name}</p>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-400 font-mono">
                        {typeof uptime === 'string' ? uptime : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-600 font-mono mt-1">Uptime</p>
                    </div>
                  </div>
                )
              }

              const periods = [
                { label: '24h', value: parseFloat(uptime.day), days: 1 },
                { label: '7d', value: parseFloat(uptime.week), days: 7 },
                { label: '30d', value: parseFloat(uptime.month), days: 30 },
                { label: '60d', value: parseFloat(uptime.twoMonths), days: 60 },
                { label: '90d', value: parseFloat(uptime.threeMonths), days: 90 }
              ]
              
              return (
                <div key={service.name} className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-base sm:text-lg font-semibold text-white font-mono break-all">{service.name}</p>
                  </div>
                  
                  <div className="space-y-4">
                    {periods.map((period) => {
                      const percentage = period.value
                      const isExcellent = percentage >= 99.9
                      const isGood = percentage >= 99.0
                      const barColor = isExcellent ? 'bg-green-400' : isGood ? 'bg-yellow-400' : 'bg-red-400'
                      const textColor = isExcellent ? 'text-green-400' : isGood ? 'text-yellow-400' : 'text-red-400'
                      
                      return (
                        <div key={period.label}>
                          <div className="flex items-center justify-between mb-2 gap-2">
                            <span className="text-xs text-gray-500 font-mono w-8 sm:w-12 flex-shrink-0">{period.label}</span>
                            <div className="flex-1 min-w-0">
                              <div className="h-6 sm:h-8 bg-[#1a1a1a] rounded-lg overflow-hidden relative">
                                <div 
                                  className={`h-full ${barColor} transition-all duration-500 flex items-center justify-end pr-2 sm:pr-3`}
                                  style={{ width: `${percentage}%` }}
                                >
                                  {percentage >= 50 && (
                                    <span className="text-xs font-bold text-black font-mono hidden sm:inline">
                                      {percentage.toFixed(2)}%
                                    </span>
                                  )}
                                </div>
                                {percentage < 50 && (
                                  <span className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-xs font-bold ${textColor} font-mono`}>
                                    {percentage.toFixed(2)}%
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className={`text-xs font-mono ${textColor} w-12 sm:w-16 text-right flex-shrink-0`}>
                              {isExcellent ? '⚡' : isGood ? '✓' : '⚠'}
                              <span className="hidden sm:inline">
                                {isExcellent ? ' Great' : isGood ? ' Good' : ' Poor'}
                              </span>
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-6 pt-4 border-t border-[#2a2a2a] flex items-center justify-center gap-6 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-400"></div>
                      <span className="text-gray-500">≥99.9%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-yellow-400"></div>
                      <span className="text-gray-500">≥99.0%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-400"></div>
                      <span className="text-gray-500">&lt;99.0%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Real-time Incidents from UptimeRobot */}
      {!loading && services.some(s => s.incidents && s.incidents.length > 0) && (
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-white font-mono">Incidents</h2>
          <div className="space-y-4">
            {services.flatMap(service => 
              (service.incidents || []).map((incident, index) => {
                const incidentDate = new Date(incident.date)
                const durationMinutes = Math.floor(incident.duration / 60)
                
                return (
                  <div
                    key={`${service.name}-${index}`}
                    className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-4 sm:p-6"
                  >
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <span className="text-xs sm:text-sm text-gray-500 font-mono break-words">
                            {incidentDate.toLocaleString()}
                          </span>
                          <span className="px-2 py-1 text-xs rounded bg-green-900/20 text-green-400 border border-green-900 font-mono inline-block w-fit">
                            Resolved
                          </span>
                        </div>
                        <h3 className="font-semibold text-white font-mono mb-1 text-sm sm:text-base break-words">
                          {service.name} - {incident.reason}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 font-mono">
                          {durationMinutes} min downtime
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            ).slice(0, 5)}
          </div>
        </section>
      )}

      {/* Response Time Performance */}
      {!loading && services.some(s => s.responseTime !== undefined && s.responseTime > 0) && (
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-white font-mono">Performance</h2>
          <div className="grid gap-4">
            {services.filter(s => s.responseTime !== undefined && s.responseTime > 0).map((service) => {
              const responseTime = service.responseTime!
              const hasChart = service.responseTimeChart && service.responseTimeChart.length > 0
              const maxValue = hasChart ? Math.max(...service.responseTimeChart!.map(d => d.value)) : responseTime
              
              return (
                <div
                  key={service.name}
                  className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white font-mono mb-1 text-sm sm:text-base break-all">{service.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 font-mono">Avg. response (30d)</p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="text-xl sm:text-2xl font-bold text-blue-400 font-mono">
                        {responseTime}ms
                      </p>
                      <p className={`text-xs font-mono mt-1 ${
                        responseTime < 200 ? 'text-green-400' :
                        responseTime < 500 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {responseTime < 200 ? '⚡ Excellent' : 
                         responseTime < 500 ? '✓ Good' : '⚠ Slow'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Response Time Chart - Last 24 Hours */}
                  {hasChart && (
                    <div className="mt-6">
                      <p className="text-xs text-gray-500 font-mono mb-3">Last 24 Hours</p>
                      <div className="flex items-end gap-1 h-24">
                        {service.responseTimeChart!.map((point, index) => {
                          const height = (point.value / maxValue) * 100
                          const color = point.value < 200 ? 'bg-green-400' : 
                                       point.value < 500 ? 'bg-yellow-400' : 'bg-red-400'
                          return (
                            <div
                              key={index}
                              className="flex-1 relative group"
                            >
                              <div
                                className={`${color} rounded-t transition-all`}
                                style={{ height: `${height}%` }}
                              ></div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                {point.value}ms
                                <br />
                                {new Date(point.time).toLocaleTimeString()}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-600 font-mono">
                        <span>24h ago</span>
                        <span>Now</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Last Updated */}
      <div className="text-center text-xs sm:text-sm text-gray-500 font-mono">
        {loading ? (
          <span>Loading status...</span>
        ) : (
          <>
            Last updated: <span className="break-all">{lastUpdate.toLocaleString()}</span>
            <br />
            <span className="text-xs">Auto-refreshes every 30 seconds</span>
          </>
        )}
      </div>
    </div>
  )
}
