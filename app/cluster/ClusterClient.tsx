'use client'

import NodeMetrics from '@/components/NodeMetrics'

export default function ClusterClient() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white font-mono break-words">Cluster Metrics</h1>
        <p className="text-sm sm:text-base text-gray-400 font-mono">
          Real-time resource monitoring for all cluster nodes
        </p>
      </div>

      {/* Node Metrics */}
      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-white font-mono">Node Resources</h2>
        <NodeMetrics />
      </section>
    </div>
  )
}
