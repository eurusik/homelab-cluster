export default function ArchitecturePage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold mb-4 dark:text-white">K3s Architecture</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Overview of the cluster architecture and components.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Why K3s?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            K3s is a lightweight Kubernetes distribution perfect for resource-constrained environments like Raspberry Pi clusters. 
            It packages everything needed into a single binary under 100MB.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Lightweight</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Minimal resource footprint</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Production Ready</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">CNCF certified Kubernetes</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Easy to Install</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Single command installation</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Cluster Architecture</h2>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm">
{`┌─────────────────────────────────────────────────────────┐
│                    K3s Master Node                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Control Plane Components                  │   │
│  │  • API Server    • Scheduler                      │   │
│  │  • Controller    • etcd (embedded)                │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Node Components                           │   │
│  │  • kubelet       • kube-proxy                     │   │
│  │  • containerd    • Traefik (ingress)              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼──────┐   ┌────────▼─────┐   ┌────────▼─────┐
│ Worker Node 1│   │ Worker Node 2│   │ Worker Node 3│
│  • kubelet   │   │  • kubelet   │   │  • kubelet   │
│  • kube-proxy│   │  • kube-proxy│   │  • kube-proxy│
│  • containerd│   │  • containerd│   │  • containerd│
│              │   │              │   │              │
│  [Pods]      │   │  [Pods]      │   │  [Pods]      │
└──────────────┘   └──────────────┘   └──────────────┘`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Key Components</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 bg-white dark:bg-gray-800 p-4 rounded-r-lg">
              <h3 className="font-semibold mb-2 dark:text-white">Control Plane (Master Node)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manages the cluster, schedules workloads, and maintains desired state. Runs API server, scheduler, and controller manager.
              </p>
            </div>
            <div className="border-l-4 border-green-500 bg-white dark:bg-gray-800 p-4 rounded-r-lg">
              <h3 className="font-semibold mb-2 dark:text-white">Worker Nodes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Execute containerized applications. Run kubelet (node agent), kube-proxy (networking), and container runtime.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 bg-white dark:bg-gray-800 p-4 rounded-r-lg">
              <h3 className="font-semibold mb-2 dark:text-white">Embedded etcd</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Distributed key-value store for cluster state. K3s includes SQLite as alternative for single-node setups.
              </p>
            </div>
            <div className="border-l-4 border-orange-500 bg-white dark:bg-gray-800 p-4 rounded-r-lg">
              <h3 className="font-semibold mb-2 dark:text-white">Traefik Ingress</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Built-in ingress controller for routing external traffic to services. Automatically configured with K3s.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Resource Allocation</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Node</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">CPU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Memory</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Available for Pods</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium dark:text-gray-300">Master</td>
                  <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">4 cores</td>
                  <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">8 GB</td>
                  <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">~6 GB</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium dark:text-gray-300">Worker 1-3</td>
                  <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">4 cores each</td>
                  <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">8 GB each</td>
                  <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">~7 GB each</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap font-bold dark:text-gray-200">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold dark:text-gray-200">16 cores</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold dark:text-gray-200">32 GB</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold dark:text-gray-200">~27 GB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
