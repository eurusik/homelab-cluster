import { generateMetadata as genMeta } from '@/lib/metadata'
import PageLayout from '@/layouts/PageLayout'
import InfoBlock from '@/components/InfoBlock'
import TipBlock from '@/components/TipBlock'
import TimelineStep from '@/components/TimelineStep'
import TimelineGroup from '@/components/TimelineGroup'
import CodeBlock from '@/components/CodeBlock'
import Image from 'next/image'

export const metadata = genMeta({
  title: 'Setup Raspberry Pi for K3s Cluster',
  description: 'Complete guide to preparing Raspberry Pi boards for K3s cluster. OS installation, SSH configuration, cgroups setup, and static IP assignment.',
  path: '/guides/setup-raspberry-pi',
  keywords: ['raspberry pi setup', 'raspberry pi os', 'ssh configuration', 'static ip', 'cgroups'],
})

export default function SetupRaspberryPiPage() {
  const tocSections = [
    { id: 'prerequisites', label: 'Prerequisites' },
    { id: 'install-os', label: 'Install OS' },
    { id: 'initial-boot', label: 'Enable Cgroups' },
    { id: 'static-ips', label: 'Static IPs' },
  ]

  return (
    <PageLayout
      breadcrumb="Guides"
      title="Setup Raspberry Pis"
      subtitle="Get every Pi ready to join the cluster."
      tocSections={tocSections}
      prevPage={{ href: '/guides', label: 'GUIDES' }}
      nextPage={{ href: '/guides/install-k3s', label: 'INSTALL K3S' }}
    >

        <div className="space-y-12">
          {/* Intro */}
          <section>
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Intro</h2>
            <p className="text-gray-400 mb-4 font-mono">
              Before starting, I'd like to give a special thanks to <a href="https://www.youtube.com/@NetworkChuck" className="text-[#ff8c00] hover:underline font-bold">NetworkChuck</a> for the excellent video on setting up a Raspberry Pi cluster.
            </p>
            <p className="text-gray-400 mb-4 font-mono">
              This guide follows that video's instructions with some updates to reflect changes in the Raspberry Pi Imager.
            </p>
            <TipBlock>
              Make sure to follow these steps for <span className="font-bold">all</span> your Raspberry Pis (RpiMaster, RpiWorker #1, RpiWorker #2).
            </TipBlock>
          </section>

          {/* Setup Image */}
          <section className="my-12">
            <div className="relative w-full max-w-3xl mx-auto rounded-lg overflow-hidden border border-[#ff8c00] shadow-lg">
              <Image
                src="/images/setup-pi.webp"
                alt="Raspberry Pi Setup Process"
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                priority
                quality={75}
              />
            </div>
          </section>

          {/* Prerequisites */}
          <section id="prerequisites">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Prerequisites</h2>
            <p className="text-gray-400 mb-6 font-mono">
              There is a single prerequisite for this guide:
            </p>
            <ul className="list-disc list-inside text-gray-300 font-mono mb-6">
              <li>Download and install <a href="https://www.raspberrypi.com/software/" className="text-[#ff8c00] hover:underline font-bold">Raspberry Pi Imager</a></li>
            </ul>
            <InfoBlock>
              This guide shows how to setup a <span className="font-bold">Raspberry Pi 5</span> using Raspberry Pi Imager <span className="font-bold">v1.8.5</span>
            </InfoBlock>
          </section>

          {/* Install OS */}
          <section id="install-os">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Install OS</h2>
            
            <TimelineGroup>
              <TimelineStep stepNumber={1} title="Choose Device">
                <p className="text-gray-400 font-mono">
                  First, select your device. In this case, we are using a Raspberry Pi 5.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={2} title="Choose OS">
                <p className="text-gray-400 font-mono">
                  Select <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">Raspberry Pi OS Lite (64-bit)</code> as your headless operating system.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={3} title="Choose Storage">
                <p className="text-gray-400 font-mono">
                  Select the storage device (microSD card) where you want to install the operating system.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={4} title="Set Hostname, Username and Password">
                <p className="text-gray-400 font-mono mb-4">
                  Click the gear icon ⚙️ to access advanced settings. Under the <span className="font-bold">General</span> tab:
                </p>
                <ul className="list-disc list-inside text-gray-300 font-mono space-y-2 ml-4 mb-4">
                  <li>Set hostname (e.g., rpimaster, rpiworker1, rpiworker2)</li>
                  <li>Set username and password (password will be used for SSH)</li>
                  <li>Configure WiFi (optional)</li>
                  <li>Set locale settings</li>
                </ul>
                <TipBlock>
                  Use the same name for <span className="font-bold">Username</span> and <span className="font-bold">Hostname</span> for consistency.
                </TipBlock>
              </TimelineStep>

              <TimelineStep stepNumber={5} title="Enable SSH">
                <p className="text-gray-400 font-mono">
                  Under the <span className="font-bold">Services</span> tab, enable SSH to allow remote access to your Pi.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={6} title="Write to SD Card">
                <p className="text-gray-400 font-mono mb-4">
                  Save the changes and click <span className="font-bold">Write</span>. The Imager will flash the OS to your microSD card.
                </p>
                <p className="text-gray-400 font-mono">
                  Repeat this process for all your Pis with different hostnames.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={7} title="Boot Up Your Pi">
                <p className="text-gray-400 font-mono">
                  Insert the microSD card into your Raspberry Pi, connect power, and allow approximately 5 minutes for the initial boot process.
                </p>
              </TimelineStep>
            </TimelineGroup>
          </section>

          {/* Enable Cgroups */}
          <section id="initial-boot">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Enable Cgroups</h2>
            <p className="text-gray-400 mb-6 font-mono">
              As mentioned in the <a href="https://docs.k3s.io/advanced#raspberry-pi" className="text-[#ff8c00] hover:underline font-bold">K3s docs</a>, standard Raspberry Pi OS installations do not start with cgroups enabled. K3s requires cgroups to start the systemd service.
            </p>

            <TimelineGroup>
              <TimelineStep stepNumber={1} title="Reconnect the Storage Device">
                <p className="text-gray-400 font-mono">
                  After letting your Pi boot for the first time, turn it off and reconnect the microSD card to your computer.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={2} title="Open cmdline.txt">
                <p className="text-gray-400 font-mono">
                  Navigate to your microSD card and open the file named <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">cmdline.txt</code>.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={3} title="Enable Cgroups">
                <p className="text-gray-400 font-mono mb-4">
                  Add the following code to the <span className="font-bold">end</span> of the file:
                </p>
                <CodeBlock code="cgroup_memory=1 cgroup_enable=memory" />
                <p className="text-gray-400 font-mono mt-4">
                  Save the file after adding this line.
                </p>
              </TimelineStep>

              <TimelineStep stepNumber={4} title="Boot Up Your Pi (Again)">
                <p className="text-gray-400 font-mono">
                  Remove the microSD card from your computer, insert it back into the Pi, and power it up to reboot.
                </p>
              </TimelineStep>
            </TimelineGroup>
          </section>

          {/* Static IPs */}
          <section id="static-ips">
            <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Setting a Static IP</h2>
            
            <TimelineGroup>
              <TimelineStep stepNumber={1} title="Connect via SSH">
                <p className="text-gray-400 font-mono mb-4">
                  Open the terminal and connect to your Pi using:
                </p>
                <CodeBlock code="ssh <username>@<hostname>" />
              </TimelineStep>

              <TimelineStep stepNumber={2} title="Set the Static IP">
                <p className="text-gray-400 font-mono mb-4">
                  Configure the static IP using nmcli. You need to define:
                </p>
                <ul className="list-disc list-inside text-gray-300 font-mono space-y-2 ml-4 mb-4">
                  <li><code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">ipv4.addresses</code> – The IP of this machine</li>
                  <li><code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">ipv4.gateway</code> – The router or default gateway (192.168.88.1)</li>
                  <li><code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">ipv4.dns</code> – The DNS server to use (192.168.88.1)</li>
                  <li><code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">ipv4.method</code> – Set to manual</li>
                </ul>
                <CodeBlock code={`nmcli connection modify "Wired connection 1" \\
  ipv4.addresses <your_desired_ip>/24 \\
  ipv4.gateway 192.168.88.1 \\
  ipv4.dns 192.168.88.1 \\
  ipv4.method manual`} />
                <div className="mt-4">
                  <TipBlock>
                    Use <span className="font-bold">192.168.88.5</span> for RpiMaster, <span className="font-bold">192.168.88.6</span> for RpiWorker #1, and <span className="font-bold">192.168.88.7</span> for RpiWorker #2
                  </TipBlock>
                </div>
              </TimelineStep>

              <TimelineStep stepNumber={3} title="Reboot Pi">
                <p className="text-gray-400 font-mono mb-4">
                  For these changes to take effect, reboot your Pi:
                </p>
                <CodeBlock code="reboot" />
                <p className="text-gray-400 font-mono mt-4">
                  After reboot, verify you can SSH to the node using its new static IP.
                </p>
              </TimelineStep>
            </TimelineGroup>
          </section>

          <InfoBlock>
            <span className="font-bold">Checkpoint:</span> All Raspberry Pis should now be accessible via SSH with static IPs. You're ready to install K3s!
          </InfoBlock>
        </div>
    </PageLayout>
  )
}
