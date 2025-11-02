import { generateMetadata as genMeta, generateHowToStructuredData } from '@/lib/metadata'
import PageLayout from '@/layouts/PageLayout'
import InfoBlock from '@/components/InfoBlock'
import TipBlock from '@/components/TipBlock'
import TimelineStep from '@/components/TimelineStep'
import TimelineGroup from '@/components/TimelineGroup'
import CodeBlock from '@/components/CodeBlock'

export const metadata = genMeta({
  title: 'K3s High Availability with Ansible',
  description: 'Fully automated High Availability K3s installation using Ansible, etcd, MetalLB, and kube-vip. Production-ready cluster deployment.',
  path: '/guides/k3s-ha-ansible',
  keywords: ['k3s ha', 'ansible automation', 'etcd', 'metallb', 'kube-vip', 'high availability'],
})

export default function K3sHAAnsibelPage() {
  const tocSections = [
    { id: 'intro', label: 'Intro' },
    { id: 'prerequisites', label: 'Prerequisites' },
    { id: 'prep', label: 'Preparation' },
    { id: 'installation', label: 'Install K3s' },
    { id: 'testing', label: 'Testing' },
    { id: 'reset', label: 'Reset Cluster' },
  ]

  return (
    <PageLayout
      breadcrumb="Guides"
      title="Fully Automated K3s HA Install"
      subtitle="Set up a High Availability K3s cluster using etcd, MetalLB, kube-vip, and Ansible."
      tocSections={tocSections}
      prevPage={{ href: '/guides/install-k3s', label: 'INSTALL K3S' }}
      nextPage={{ href: '/guides', label: 'GUIDES' }}
    >

        <div className="space-y-12">
          {/* Intro */}
          <section id="intro">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Intro</h2>
            <p className="text-gray-400 mb-4 font-mono">
              Setting up K3s can be complex and time-consuming. This guide automates the entire process, giving you an easy, repeatable way to create a production-ready K3s cluster in just a few minutes.
            </p>
            <p className="text-gray-400 mb-4 font-mono">
              This guide is based on <a href="https://technotim.live/posts/k3s-etcd-ansible/" className="text-[#ff8c00] hover:underline font-bold">TechnoTim's excellent tutorial</a> for setting up K3s with High Availability using etcd, MetalLB for load balancing, kube-vip for control plane HA, and Ansible for automation.
            </p>
            <p className="text-gray-400 mb-4 font-mono">
              By using Ansible, we can provision multiple master nodes with etcd for true High Availability, ensuring your cluster continues to function even if one or more control plane nodes fail.
            </p>
          </section>

          {/* Prerequisites */}
          <section id="prerequisites">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Prerequisites</h2>
            <p className="text-gray-400 mb-6 font-mono">
              Before starting this guide, ensure you have:
            </p>
            <ul className="list-disc list-inside text-gray-300 font-mono mb-6 space-y-2">
              <li>Ansible 2.11+ installed on your local machine</li>
              <li>3 or more VMs provisioned for master nodes (for HA)</li>
              <li>2 or more VMs provisioned for worker nodes</li>
              <li>All nodes with static IP addresses</li>
              <li>SSH access to all nodes</li>
              <li>Basic knowledge of Kubernetes concepts</li>
            </ul>
            <InfoBlock>
              <span className="font-bold">High Availability:</span> For true HA, you need at least 3 master nodes running etcd. This allows the cluster to tolerate the loss of one master node.
            </InfoBlock>
          </section>

          {/* Preparation */}
          <section id="prep">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Preparation</h2>
            
            <TimelineGroup>
              <TimelineStep stepNumber={1} title="Install Ansible">
                <p className="text-gray-400 font-mono mb-4">
                  Verify that Ansible is installed and at version 2.11 or higher:
                </p>
                <CodeBlock code="ansible --version" />
                <p className="text-gray-400 font-mono mt-4">
                  If you need to install or update Ansible, follow the <a href="https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html" className="text-[#ff8c00] hover:underline font-bold">official installation guide</a>.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={2} title="Clone the Repository">
                <p className="text-gray-400 font-mono mb-4">
                  Clone the k3s-ansible repository. This repo contains all the automation needed to deploy K3s:
                </p>
                <CodeBlock code="git clone https://github.com/timothystewart6/k3s-ansible" />
                <p className="text-gray-400 font-mono mt-4">
                  Navigate into the repository:
                </p>
                <CodeBlock code="cd k3s-ansible" />
                <div className="mt-4">
                  <TipBlock>
                    Consider forking the repository first so you can track your own changes and configurations!
                  </TipBlock>
                </div>
              </TimelineStep>

              <TimelineStep stepNumber={3} title="Configure Ansible">
                <p className="text-gray-400 font-mono mb-4">
                  Create a local copy of the Ansible configuration file:
                </p>
                <CodeBlock code="cp ansible.example.cfg ansible.cfg" />
                <p className="text-gray-400 font-mono mt-4">
                  The defaults should work without modification, but you can adapt this file to suit your specific needs.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={4} title="Install Ansible Requirements">
                <p className="text-gray-400 font-mono mb-4">
                  Install the required Ansible Galaxy collections and roles:
                </p>
                <CodeBlock code="ansible-galaxy install -r ./collections/requirements.yml" />
                <p className="text-gray-400 font-mono mt-4">
                  This installs dependencies needed for the playbooks to run successfully.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={5} title="Create Cluster Inventory">
                <p className="text-gray-400 font-mono mb-4">
                  Copy the sample inventory directory to create your cluster configuration:
                </p>
                <CodeBlock code="cp -R inventory/sample inventory/my-cluster" />
                <p className="text-gray-400 font-mono mt-4">
                  This creates a new inventory folder where you'll define your cluster nodes and settings.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={6} title="Configure Hosts">
                <p className="text-gray-400 font-mono mb-4">
                  Edit <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">inventory/my-cluster/hosts.ini</code> to define your master and worker nodes:
                </p>
                <CodeBlock code={`[master]
192.168.88.5
192.168.88.6
192.168.88.7

[node]
192.168.88.10
192.168.88.11

[k3s_cluster:children]
master
node`} />
                <p className="text-gray-400 font-mono mt-4">
                  Replace these IP addresses with your actual node IPs. You can also use DNS hostnames if configured.
                </p>
                <div className="mt-4">
                  <InfoBlock>
                    The <span className="font-bold">[master]</span> section defines control plane nodes, while <span className="font-bold">[node]</span> defines worker nodes.
                  </InfoBlock>
                </div>
              </TimelineStep>

              <TimelineStep stepNumber={7} title="Configure Cluster Variables">
                <p className="text-gray-400 font-mono mb-4">
                  Edit <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">inventory/my-cluster/group_vars/all.yml</code> to configure your cluster settings:
                </p>
                <CodeBlock code={`# Define the API server endpoint (VIP for HA)
apiserver_endpoint: "192.168.88.100"

# MetalLB IP range for LoadBalancer services
metal_lb_ip_range: "192.168.88.200-192.168.88.250"

# K3s server arguments
extra_server_args: >-
  --node-taint node-role.kubernetes.io/master=true:NoSchedule
  --tls-san 192.168.88.100
  --disable servicelb
  --disable traefik

# K3s agent arguments
extra_agent_args: >-
  `} />
                <p className="text-gray-400 font-mono mt-4">
                  Key settings explained:
                </p>
                <ul className="list-disc list-inside text-gray-300 font-mono space-y-2 ml-4 mt-2">
                  <li><code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">apiserver_endpoint</code> – Virtual IP for the control plane (provided by kube-vip)</li>
                  <li><code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">metal_lb_ip_range</code> – IP range MetalLB will use for services</li>
                  <li><code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">--disable servicelb</code> – We'll use MetalLB instead</li>
                  <li><code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">--disable traefik</code> – Install Traefik later with Helm for better control</li>
                </ul>
                <div className="mt-4">
                  <TipBlock>
                    Start with these default values. Only modify advanced settings if you understand the implications, as incorrect values can cause instability.
                  </TipBlock>
                </div>
              </TimelineStep>
            </TimelineGroup>
          </section>

          {/* Installation */}
          <section id="installation">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Install K3s</h2>
            
            <TimelineGroup>
              <TimelineStep stepNumber={1} title="Run Ansible Playbook">
                <p className="text-gray-400 font-mono mb-4">
                  Start the automated provisioning of your K3s cluster:
                </p>
                <CodeBlock code="ansible-playbook ./site.yml -i ./inventory/my-cluster/hosts.ini" />
                <p className="text-gray-400 font-mono mt-4">
                  If you're using password-based SSH authentication instead of SSH keys, add authentication flags:
                </p>
                <CodeBlock code="ansible-playbook ./site.yml -i ./inventory/my-cluster/hosts.ini --ask-pass --ask-become-pass" />
                <div className="mt-4">
                  <InfoBlock>
                    The playbook will install K3s on all nodes, configure etcd for HA, set up kube-vip for the VIP, and deploy MetalLB. This process typically takes 5-10 minutes.
                  </InfoBlock>
                </div>
              </TimelineStep>

              <TimelineStep stepNumber={2} title="Copy Kubeconfig">
                <p className="text-gray-400 font-mono mb-4">
                  After deployment, copy the kubeconfig from one of your master nodes to your local machine:
                </p>
                <CodeBlock code="scp ansibleuser@192.168.88.5:~/.kube/config ~/.kube/config" />
                <p className="text-gray-400 font-mono mt-4">
                  Replace <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">ansibleuser</code> with your actual SSH username and <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">192.168.88.5</code> with one of your master node IPs.
                </p>
                <div className="mt-4">
                  <TipBlock>
                    Make sure <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">~/.kube/</code> directory exists on your local machine before running this command.
                  </TipBlock>
                </div>
              </TimelineStep>
            </TimelineGroup>
          </section>

          {/* Testing */}
          <section id="testing">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Testing Your Cluster</h2>
            
            <TimelineGroup>
              <TimelineStep stepNumber={1} title="Test VIP Connectivity">
                <p className="text-gray-400 font-mono mb-4">
                  Verify that the virtual IP (VIP) defined in your configuration is accessible:
                </p>
                <CodeBlock code="ping 192.168.88.100" />
                <p className="text-gray-400 font-mono mt-4">
                  If the VIP responds, kube-vip is working correctly and providing high availability for your control plane.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={2} title="Check Cluster Nodes">
                <p className="text-gray-400 font-mono mb-4">
                  Verify all nodes are connected and in Ready state:
                </p>
                <CodeBlock code="kubectl get nodes" />
                <p className="text-gray-400 font-mono mt-4">
                  You should see all your master and worker nodes listed with <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">Ready</code> status.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={3} title="Deploy Test Application">
                <p className="text-gray-400 font-mono mb-4">
                  Deploy a sample nginx workload to test your cluster:
                </p>
                <CodeBlock code="kubectl apply -f example/deployment.yml" />
                <p className="text-gray-400 font-mono mt-4">
                  Verify the deployment was created successfully:
                </p>
                <CodeBlock code="kubectl describe deployment nginx" />
              </TimelineStep>

              <TimelineStep stepNumber={4} title="Test LoadBalancer">
                <p className="text-gray-400 font-mono mb-4">
                  Deploy a service with LoadBalancer type to test MetalLB:
                </p>
                <CodeBlock code="kubectl apply -f example/service.yml" />
                <p className="text-gray-400 font-mono mt-4">
                  Check that the service received an external IP from MetalLB:
                </p>
                <CodeBlock code="kubectl describe service nginx" />
                <p className="text-gray-400 font-mono mt-4">
                  You should see an IP address from your configured MetalLB range. Test access to the nginx welcome page:
                </p>
                <CodeBlock code="curl http://192.168.88.200" />
                <div className="mt-4">
                  <InfoBlock>
                    If you see the nginx welcome page, congratulations! Your HA cluster with MetalLB is fully functional.
                  </InfoBlock>
                </div>
              </TimelineStep>

              <TimelineStep stepNumber={5} title="Clean Up Test Resources">
                <p className="text-gray-400 font-mono mb-4">
                  Remove the test deployment and service:
                </p>
                <CodeBlock code={`kubectl delete -f example/deployment.yml
kubectl delete -f example/service.yml`} />
              </TimelineStep>
            </TimelineGroup>
          </section>

          {/* Reset */}
          <section id="reset">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Reset Cluster</h2>
            <p className="text-gray-400 mb-6 font-mono">
              If you need to completely remove K3s from all nodes and start fresh, you can use the reset playbook.
            </p>
            
            <TimelineGroup>
              <TimelineStep stepNumber={1} title="Run Reset Playbook">
                <p className="text-gray-400 font-mono mb-4">
                  This will uninstall K3s from all nodes in your cluster:
                </p>
                <CodeBlock code="ansible-playbook ./reset.yml -i ./inventory/my-cluster/hosts.ini" />
                <div className="mt-4">
                  <TipBlock>
                    <span className="font-bold">Warning:</span> This will completely remove K3s and all cluster data. Nodes should be rebooted after this operation.
                  </TipBlock>
                </div>
              </TimelineStep>

              <TimelineStep stepNumber={2} title="Reboot Nodes">
                <p className="text-gray-400 font-mono mb-4">
                  After running the reset playbook, reboot all nodes to ensure a clean state:
                </p>
                <CodeBlock code="ansible all -i ./inventory/my-cluster/hosts.ini -m reboot" />
              </TimelineStep>
            </TimelineGroup>
          </section>

          <InfoBlock>
            <span className="font-bold">Checkpoint:</span> Your High Availability K3s cluster is now running with etcd, kube-vip, and MetalLB. You can now deploy applications, install Traefik with Helm, or set up Rancher for cluster management!
          </InfoBlock>
        </div>
    </PageLayout>
  )
}
