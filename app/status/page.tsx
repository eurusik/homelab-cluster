'use client'

import { useEffect, useState } from 'react'

type ServiceStatus = 'operational' | 'degraded' | 'outage'

interface Service {
  name: string
  description: string
  status: ServiceStatus
  url?: string
  uptime?: string
}

interface HealthCheckResponse {
  services: {
    name: string
    status: ServiceStatus
  }[]
  timestamp: string
}

const staticServices: Service[] = [
  {
    name: 'Documentation Website',
    description: 'K3s Homelab Documentation',
    status: 'operational',
    url: 'https://homelab.eurusik.tech',
    uptime: '99.9%'
  },
  {
    name: 'K3s Cluster',
    description: 'Kubernetes Infrastructure',
    status: 'operational',
    uptime: '100%'
  },
  {
    name: 'GitOps (ArgoCD)',
    description: 'Continuous Deployment',
    status: 'operational',
    uptime: '99.8%'
  }
]

const pastIncidents = [
  {
    date: 'Nov 2, 2024',
    title: 'Brief service interruption',
    duration: '5 minutes',
    status: 'resolved' as const
  }
]

export default function StatusPage() {
  const [services, setServices] = useState<Service[]>(staticServices)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)

  const checkHealth = async () => {
    try {
      // Fetch from UptimeRobot integration
      const response = await fetch('/api/uptime')
      if (response.ok) {
        const data = await response.json()
        
        if (data.services) {
          setServices(data.services.map((s: any) => ({
            name: s.name,
            description: getServiceDescription(s.name),
            status: s.status,
            uptime: s.uptime,
            url: s.url || getServiceUrl(s.name)
          })))
        }
      }
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Health check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const getServiceDescription = (name: string) => {
    const descriptions: Record<string, string> = {
      'Documentation Website': 'K3s Homelab Documentation',
      'K3s Cluster': 'Kubernetes Infrastructure',
      'GitOps (ArgoCD)': 'Continuous Deployment'
    }
    return descriptions[name] || 'Service'
  }

  const getServiceUrl = (name: string) => {
    const urls: Record<string, string> = {
      'Documentation Website': 'https://homelab.eurusik.tech'
    }
    return urls[name]
  }

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const hasDegraded = services.some(s => s.status === 'degraded')
  const hasOutage = services.some(s => s.status === 'outage')

  const overallStatus = hasOutage ? 'outage' : hasDegraded ? 'degraded' : 'operational'

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return 'text-green-400 bg-green-900/20 border-green-900'
      case 'degraded':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-900'
      case 'outage':
        return 'text-red-400 bg-red-900/20 border-red-900'
    }
  }

  const getStatusText = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return 'All Systems Operational'
      case 'degraded':
        return 'Partial Outage'
      case 'outage':
        return 'Major Outage'
    }
  }

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
    <div className="max-w-5xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white font-mono">System Status</h1>
        <p className="text-gray-400 font-mono">
          Real-time status of all K3s Homelab services
        </p>
      </div>

      {/* Overall Status Badge */}
      <div className={`mb-12 inline-flex items-center gap-3 px-6 py-4 rounded-lg font-mono border ${getStatusColor(overallStatus)}`}>
        <span className={`w-4 h-4 rounded-full ${getStatusDot(overallStatus)}`}></span>
        <span className="text-lg font-semibold">{getStatusText(overallStatus)}</span>
      </div>

      {/* Services Status */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-white font-mono">Services</h2>
        <div className="grid gap-4">
          {services.map((service) => (
            <div
              key={service.name}
              className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-6 hover:border-[#3a3a3a] transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <span className={`w-3 h-3 rounded-full mt-1 ${getStatusDot(service.status)}`}></span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white font-mono">{service.name}</h3>
                      {service.url && (
                        <a
                          href={service.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 font-mono">{service.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-mono font-semibold ${
                    service.status === 'operational' ? 'text-green-400' :
                    service.status === 'degraded' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </p>
                  {service.uptime && (
                    <p className="text-xs text-gray-500 font-mono mt-1">{service.uptime} uptime</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Uptime Stats */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-white font-mono">Uptime Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          {services.filter(s => s.uptime).map((service) => (
            <div key={service.name} className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-6 text-center">
              <p className="text-sm text-gray-500 font-mono mb-2">{service.name}</p>
              <p className="text-3xl font-bold text-green-400 font-mono">{service.uptime}</p>
              <p className="text-xs text-gray-600 font-mono mt-1">Last 30 days</p>
            </div>
          ))}
        </div>
      </section>

      {/* Incident History */}
      {pastIncidents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-white font-mono">Recent Incidents</h2>
          <div className="space-y-4">
            {pastIncidents.map((incident, index) => (
              <div
                key={index}
                className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-500 font-mono">{incident.date}</span>
                      <span className="px-2 py-1 text-xs rounded bg-green-900/20 text-green-400 border border-green-900 font-mono">
                        {incident.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white font-mono mb-1">{incident.title}</h3>
                    <p className="text-sm text-gray-500 font-mono">Duration: {incident.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500 font-mono">
        {loading ? (
          <span>Loading status...</span>
        ) : (
          <>
            Last updated: {lastUpdate.toLocaleString()}
            <br />
            <span className="text-xs">Auto-refreshes every 30 seconds</span>
          </>
        )}
      </div>
    </div>
  )
}
