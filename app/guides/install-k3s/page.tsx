import { generateMetadata as genMeta } from '@/lib/metadata'
import PageLayout from '@/layouts/PageLayout'
import InfoBlock from '@/components/InfoBlock'
import TipBlock from '@/components/TipBlock'
import TimelineStep from '@/components/TimelineStep'
import TimelineGroup from '@/components/TimelineGroup'
import CodeBlock from '@/components/CodeBlock'

export const metadata = genMeta({
  title: 'Install K3s on Raspberry Pi Cluster',
  description: 'Step-by-step K3s installation guide. Set up Kubernetes cluster with server and agent nodes on Raspberry Pi hardware.',
  path: '/guides/install-k3s',
  keywords: ['k3s installation', 'kubernetes cluster', 'server node', 'agent node', 'kubectl'],
})

export default function InstallK3sPage() {
  const tocSections = [
    { id: 'intro', label: 'Intro' },
    { id: 'prerequisites', label: 'Prerequisites' },
    { id: 'server-node', label: 'Setup Server Node' },
    { id: 'agent-nodes', label: 'Setup Agent Nodes' },
    { id: 'verify', label: 'Verify Cluster' },
  ]

  return (
    <PageLayout
      breadcrumb="Guides"
      title="Install K3s"
      subtitle="Set up the Kubernetes cluster on your Raspberry Pi nodes."
      tocSections={tocSections}
      prevPage={{ href: '/guides/setup-raspberry-pi', label: 'SETUP RASPBERRY PIS' }}
      nextPage={{ href: '/guides/k3s-ha-ansible', label: 'K3S HA WITH ANSIBLE' }}
    >

        <div className="space-y-12">
          {/* Intro */}
          <section id="intro">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Intro</h2>
            <p className="text-gray-400 mb-4 font-mono">
              In this guide, you'll learn how to install K3s and set up your Kubernetes cluster using the <span className="font-bold">Single Server Architecture</span> explained in the <a href="/architecture" className="text-[#ff8c00] hover:underline font-bold">K3s Architecture</a> page.
            </p>
            <p className="text-gray-400 mb-4 font-mono">
              This guide closely follows <a href="https://www.youtube.com/@NetworkChuck" className="text-[#ff8c00] hover:underline font-bold">NetworkChuck's</a> excellent video on setting up a Raspberry Pi cluster—feel free to check it out!
            </p>
            <p className="text-gray-400 mb-4 font-mono">
              K3s is a lightweight Kubernetes distribution designed for resource-constrained environments like Raspberry Pi clusters. It includes everything you need in a single binary under 100MB, making it perfect for edge computing and homelab setups.
            </p>
          </section>

          {/* Prerequisites */}
          <section id="prerequisites">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Prerequisites</h2>
            <p className="text-gray-400 mb-6 font-mono">
              This guide assumes that:
            </p>
            <ul className="list-disc list-inside text-gray-300 font-mono mb-6 space-y-2">
              <li>You have followed the <a href="/guides/setup-raspberry-pi" className="text-[#ff8c00] hover:underline font-bold">Raspberry Pi Setup Guide</a></li>
              <li>All your compute nodes are connected to the same network</li>
              <li>You have SSH access to all nodes</li>
              <li>All nodes have static IP addresses configured</li>
            </ul>
            <InfoBlock>
              <span className="font-bold">Network Configuration:</span> RpiMaster at 192.168.88.5, RpiWorker1 at 192.168.88.6, RpiWorker2 at 192.168.88.7
            </InfoBlock>
          </section>

          {/* Setup Server Node */}
          <section id="server-node">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Setup the Server Node</h2>
            <p className="text-gray-400 mb-6 font-mono">
              The server node runs the Kubernetes control plane, which manages the entire cluster. We'll install K3s in server mode on RpiMaster.
            </p>
            
            <TimelineGroup>
              <TimelineStep stepNumber={1} title="Connect to your Server Node via SSH">
                <p className="text-gray-400 font-mono mb-4">
                  Open the terminal and connect to your server node (RpiMaster) using:
                </p>
                <CodeBlock code="ssh <username>@192.168.88.5" />
                <p className="text-gray-400 font-mono mt-4">
                  Replace <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">&lt;username&gt;</code> with the username you configured during Raspberry Pi setup.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={2} title="Install K3s">
                <p className="text-gray-400 font-mono mb-4">
                  After connecting, install K3s on your server node. This command downloads and installs K3s as a systemd service:
                </p>
                <CodeBlock code="curl -sfL https://get.k3s.io | sh -" />
                <div className="mt-4">
                  <TipBlock>
                    Installation takes approximately <span className="font-bold">2-5 minutes</span>. K3s will automatically start and be configured to start on boot.
                  </TipBlock>
                </div>
                <p className="text-gray-400 font-mono mt-4">
                  The installation script will:
                </p>
                <ul className="list-disc list-inside text-gray-300 font-mono space-y-2 ml-4 mt-2">
                  <li>Download the K3s binary</li>
                  <li>Install it as a systemd service</li>
                  <li>Configure kubectl access</li>
                  <li>Start the K3s server automatically</li>
                </ul>
              </TimelineStep>

              <TimelineStep stepNumber={3} title="Get Server Token">
                <p className="text-gray-400 font-mono mb-4">
                  With K3s installed, you now need to retrieve the server token. This token authenticates agent nodes when they join the cluster.
                </p>
                <CodeBlock code="cat /var/lib/rancher/k3s/server/node-token" />
                <p className="text-gray-400 font-mono mt-4">
                  The output will be a long string like <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">K10a1b2c3d4e5f6...</code>
                </p>
                <div className="mt-4">
                  <InfoBlock>
                    <span className="font-bold">Save this token!</span> You'll need it in the next section to connect your agent nodes to the server.
                  </InfoBlock>
                </div>
              </TimelineStep>
            </TimelineGroup>
          </section>

          {/* Setup Agent Nodes */}
          <section id="agent-nodes">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Setup the Agent Nodes</h2>
            <p className="text-gray-400 mb-6 font-mono">
              Agent nodes are worker nodes that run your containerized applications. They connect to the server node and receive instructions from the control plane.
            </p>
            <TipBlock>
              Repeat this process for <span className="font-bold">each agent node</span> to connect them all to your server (RpiWorker1 and RpiWorker2).
            </TipBlock>

            <div className="mt-6">
              <TimelineGroup>
                <TimelineStep stepNumber={1} title="Connect to your Agent Node via SSH">
                  <p className="text-gray-400 font-mono mb-4">
                    Open the terminal and connect to your first worker node:
                  </p>
                  <CodeBlock code="ssh <username>@192.168.88.6" />
                  <p className="text-gray-400 font-mono mt-4">
                    For the second worker node, use <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">192.168.88.7</code> instead.
                  </p>
                </TimelineStep>

                <TimelineStep stepNumber={2} title="Install K3s as Agent">
                  <p className="text-gray-400 font-mono mb-4">
                    Before installation, you'll need two things:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 font-mono space-y-2 ml-4 mb-4">
                    <li>The server node IP address: <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">192.168.88.5</code></li>
                    <li>The server node token from the previous section</li>
                  </ul>
                  <p className="text-gray-400 font-mono mb-4">
                    Use these values to complete and run the following command:
                  </p>
                  <CodeBlock code={`curl -sfL https://get.k3s.io | K3S_URL=https://192.168.88.5:6443 K3S_TOKEN=<server_node_token> sh -`} />
                  <p className="text-gray-400 font-mono mt-4">
                    Replace <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">&lt;server_node_token&gt;</code> with the actual token you saved earlier.
                  </p>
                  <div className="mt-4">
                    <InfoBlock>
                      This command tells K3s to install in agent mode and connect to the server at <span className="font-bold">192.168.88.5:6443</span> using the provided token for authentication.
                    </InfoBlock>
                  </div>
                </TimelineStep>
              </TimelineGroup>
            </div>

            <p className="text-gray-400 font-mono mt-8">
              You are done setting up your K3s cluster! 🎉
            </p>
          </section>

          {/* Verify Cluster */}
          <section id="verify">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Verify Your Cluster</h2>
            <p className="text-gray-400 mb-6 font-mono">
              After setting up all nodes, let's verify that everything is working correctly.
            </p>

            <TimelineGroup>
              <TimelineStep stepNumber={1} title="SSH back to Server Node">
                <p className="text-gray-400 font-mono mb-4">
                  Connect to your server node where kubectl is available:
                </p>
                <CodeBlock code="ssh <username>@192.168.88.5" />
              </TimelineStep>

              <TimelineStep stepNumber={2} title="Check Cluster Nodes">
                <p className="text-gray-400 font-mono mb-4">
                  Run the following command to see all nodes in your cluster:
                </p>
                <CodeBlock code="kubectl get nodes" />
                <p className="text-gray-400 font-mono mt-4 mb-4">
                  Expected output:
                </p>
                <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-gray-300">{`NAME         STATUS   ROLES                  AGE   VERSION
rpimaster    Ready    control-plane,master   5m    v1.28.3+k3s1
rpiworker1   Ready    <none>                 3m    v1.28.3+k3s1
rpiworker2   Ready    <none>                 2m    v1.28.3+k3s1`}</pre>
                </div>
                <p className="text-gray-400 font-mono mt-4">
                  All nodes should show <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">Ready</code> status. If a node shows <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">NotReady</code>, wait a minute and check again—it may still be initializing.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={3} title="Verify System Pods">
                <p className="text-gray-400 font-mono mb-4">
                  Check that all system components are running:
                </p>
                <CodeBlock code="kubectl get pods -A" />
                <p className="text-gray-400 font-mono mt-4">
                  You should see pods for core services like <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">coredns</code>, <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">metrics-server</code>, and <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">traefik</code> in Running state.
                </p>
              </TimelineStep>
            </TimelineGroup>
          </section>

          <InfoBlock>
            <span className="font-bold">Checkpoint:</span> Your K3s cluster is now fully operational with one server node and two agent nodes. You're ready to start deploying applications!
          </InfoBlock>
        </div>
    </PageLayout>
  )
}
