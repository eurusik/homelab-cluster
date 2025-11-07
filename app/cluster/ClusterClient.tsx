'use client'

import { useState } from 'react'
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

      {/* Info Section */}
      <section className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white font-mono mb-3">About These Metrics</h3>
        <div className="space-y-2 text-xs sm:text-sm text-gray-400 font-mono">
          <p>
            <span className="text-gray-300 font-semibold">RpiMaster (192.168.88.5)</span> - Raspberry Pi 5 running the K3s control plane
          </p>
          <p>
            <span className="text-gray-300 font-semibold">RpiWorker1 (192.168.88.6)</span> - Raspberry Pi 4 worker node
          </p>
          <p>
            <span className="text-gray-300 font-semibold">RpiWorker2 (192.168.88.7)</span> - Raspberry Pi 5 worker node
          </p>
          <p className="pt-3 text-gray-500">
            Metrics are collected via Prometheus and node_exporter, updating every 30 seconds.
          </p>
        </div>
      </section>
    </div>
  )
}
