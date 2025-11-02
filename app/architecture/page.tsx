import { generateMetadata as genMeta } from '@/lib/metadata'
import PageLayout from '@/layouts/PageLayout'
import MermaidDiagram from '@/components/MermaidDiagram'

export const metadata = genMeta({
  title: 'K3s Cluster Architecture & Components',
  description: 'Understanding K3s cluster architecture: control plane, worker nodes, Traefik ingress, and etcd. Resource allocation and component overview.',
  path: '/architecture',
  keywords: ['k3s architecture', 'control plane', 'worker nodes', 'traefik', 'etcd'],
})

export default function ArchitecturePage() {
  const tocSections = [
    { id: 'why-k3s', label: 'Why K3s?' },
    { id: 'cluster-architecture', label: 'Cluster Architecture' },
    { id: 'key-components', label: 'Key Components' },
    { id: 'resource-allocation', label: 'Resource Allocation' },
  ]

  return (
    <PageLayout
      title="K3s Architecture"
      subtitle="Lightweight Kubernetes orchestration layer running on the cluster."
      tocSections={tocSections}
      prevPage={{ href: '/networking', label: 'NETWORKING' }}
      nextPage={{ href: '/guides', label: 'GUIDES' }}
    >

      <div className="space-y-8">
        <section id="why-k3s">
          <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Why K3s?</h2>
          <p className="text-gray-400 mb-6 font-mono">
            K3s is a lightweight Kubernetes distribution perfect for resource-constrained environments like Raspberry Pi clusters. 
            It packages everything needed into a single binary under 100MB.
          </p>
        </section>

        <section id="cluster-architecture" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Cluster Architecture</h2>
          <p className="text-gray-400 mb-6 font-mono">
            The K3s cluster consists of a master node (RpiMaster) running the control plane and two worker nodes (RpiWorker #1 and #2) executing application workloads:
          </p>

          <MermaidDiagram chart={`
graph LR
    User(["User"]):::user
    Traefik["Traefik<br/>(Ingress)"]:::ingress
    K3sAPI["K3s API<br/>(Control Plane)"]:::api
    
    RpiServer["RpiMaster<br/>192.168.88.5"]:::master
    RpiAgent1["RpiWorker #1<br/>192.168.88.6"]:::worker
    RpiAgent2["RpiWorker #2<br/>192.168.88.7"]:::worker
    
    User -->|Access Apps| Traefik
    User -->|Manage Cluster| K3sAPI
    
    Traefik --> RpiServer
    K3sAPI --> RpiServer
    
    RpiServer --> RpiAgent1
    RpiServer --> RpiAgent2
    
    classDef user fill:#2a2a2a,stroke:#808080,stroke-width:2px,color:#e0e0e0
    classDef ingress fill:#1a5f7a,stroke:#4a9eff,stroke-width:2px,color:#e0e0e0
    classDef api fill:#4a3a1a,stroke:#ff8c00,stroke-width:2px,color:#e0e0e0
    classDef master fill:#7a1a1a,stroke:#ff4a4a,stroke-width:2px,color:#e0e0e0
    classDef worker fill:#1a4a1a,stroke:#4aff4a,stroke-width:2px,color:#e0e0e0
          `} />
        </section>

        <section id="key-components">
          <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Key Components</h2>
          <div className="space-y-4">
            <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#ff4a4a] transition">
              <h3 className="font-semibold mb-2 text-[#ff4a4a] font-mono text-lg">Control Plane (Master Node)</h3>
              <p className="text-sm text-gray-400 font-mono">
                The brain of the cluster running on RpiMaster. Hosts the K3s API server for cluster management, schedules pods across worker nodes, and maintains the desired cluster state. All kubectl commands connect to this component.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#4aff4a] transition">
              <h3 className="font-semibold mb-2 text-[#4aff4a] font-mono text-lg">Worker Nodes</h3>
              <p className="text-sm text-gray-400 font-mono">
                The workhorses running on RpiWorker #1 and #2. Execute containerized applications (pods), handle container lifecycle with containerd runtime, and communicate with the control plane via kubelet agents.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#4a9eff] transition">
              <h3 className="font-semibold mb-2 text-[#4a9eff] font-mono text-lg">Traefik Ingress</h3>
              <p className="text-sm text-gray-400 font-mono">
                The gateway to your applications. Routes external HTTP/HTTPS traffic to services running inside the cluster. Comes pre-installed with K3s and automatically configures based on Ingress resources.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#ff8c00] transition">
              <h3 className="font-semibold mb-2 text-[#ff8c00] font-mono text-lg">Embedded etcd</h3>
              <p className="text-sm text-gray-400 font-mono">
                The cluster's memory. Stores all cluster configuration, state, and metadata in a distributed key-value database. K3s embeds this directly into the control plane, eliminating the need for external database setup.
              </p>
            </div>
          </div>
        </section>

        <section id="resource-allocation" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Resource Allocation</h2>
          <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left px-6 py-4 font-mono text-sm text-gray-400 font-semibold">Node</th>
                  <th className="text-left px-6 py-4 font-mono text-sm text-gray-400 font-semibold">CPU</th>
                  <th className="text-left px-6 py-4 font-mono text-sm text-gray-400 font-semibold">Memory</th>
                  <th className="text-left px-6 py-4 font-mono text-sm text-gray-400 font-semibold">Available for Pods</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition">
                  <td className="px-6 py-4 font-mono text-sm text-gray-300">RpiMaster</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-300">4 cores</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-300">8 GB</td>
                  <td className="px-6 py-4 font-mono text-sm text-white font-semibold">~6 GB</td>
                </tr>
                <tr className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition">
                  <td className="px-6 py-4 font-mono text-sm text-gray-300">RpiWorker #1</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-300">4 cores</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-300">4 GB</td>
                  <td className="px-6 py-4 font-mono text-sm text-white font-semibold">~3 GB</td>
                </tr>
                <tr className="hover:bg-[#1a1a1a] transition">
                  <td className="px-6 py-4 font-mono text-sm text-gray-300">RpiWorker #2</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-300">4 cores</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-300">8 GB</td>
                  <td className="px-6 py-4 font-mono text-sm text-white font-semibold">~7 GB</td>
                </tr>
                <tr className="bg-[#1a1a1a]">
                  <td className="px-6 py-4 font-mono text-sm text-[#ff8c00] font-bold">Total</td>
                  <td className="px-6 py-4 font-mono text-sm text-[#ff8c00] font-bold">12 cores</td>
                  <td className="px-6 py-4 font-mono text-sm text-[#ff8c00] font-bold">20 GB</td>
                  <td className="px-6 py-4 font-mono text-sm text-[#ff8c00] font-bold">~16 GB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
