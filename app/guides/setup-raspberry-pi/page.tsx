export default function SetupRaspberryPiPage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold mb-4 dark:text-white">Setup Raspberry Pis</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Prepare your Raspberry Pi boards for the cluster.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Step 1: Flash the OS</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
              <li>Download <a href="https://www.raspberrypi.com/software/" className="text-blue-500 hover:underline">Raspberry Pi Imager</a></li>
              <li>Insert microSD card into your computer</li>
              <li>Open Raspberry Pi Imager</li>
              <li>Choose OS: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Raspberry Pi OS Lite (64-bit)</code></li>
              <li>Choose Storage: Select your microSD card</li>
              <li>Click the gear icon ⚙️ for advanced options:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Set hostname (e.g., k3s-master, k3s-worker-1, etc.)</li>
                  <li>Enable SSH with password authentication</li>
                  <li>Set username and password</li>
                  <li>Configure WiFi (optional)</li>
                  <li>Set locale settings</li>
                </ul>
              </li>
              <li>Click Write and wait for completion</li>
              <li>Repeat for all 4 microSD cards with different hostnames</li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Step 2: Initial Boot & Configuration</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
              <li>Insert microSD cards into Raspberry Pis</li>
              <li>Connect Ethernet cables to switch</li>
              <li>Connect power to all nodes</li>
              <li>Wait 2-3 minutes for initial boot</li>
              <li>Find IP addresses from your router's DHCP table</li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Step 3: SSH Configuration</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="mb-4 text-gray-700 dark:text-gray-300">Connect to each Pi via SSH:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
              <div>ssh pi@192.168.1.xxx</div>
            </div>
            
            <p className="mb-4 text-gray-700 dark:text-gray-300">Update the system:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
              <div>sudo apt update && sudo apt upgrade -y</div>
            </div>

            <p className="mb-4 text-gray-700 dark:text-gray-300">Enable container features:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <div>sudo nano /boot/firmware/cmdline.txt</div>
              <div className="mt-2"># Add to the end of the line:</div>
              <div>cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory</div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Step 4: Set Static IPs</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="mb-4 text-gray-700 dark:text-gray-300">Configure static IP addresses:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
              <div>sudo nano /etc/dhcpcd.conf</div>
              <div className="mt-2"># Add at the end:</div>
              <div>interface eth0</div>
              <div>static ip_address=192.168.1.101/24</div>
              <div>static routers=192.168.1.1</div>
              <div>static domain_name_servers=192.168.1.1 8.8.8.8</div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 Use .101 for master, .102-.104 for workers
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Step 5: Reboot All Nodes</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <div>sudo reboot</div>
            </div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              After reboot, verify you can SSH to each node using their static IPs.
            </p>
          </div>
        </section>

        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">✅ Checkpoint</h3>
          <p className="text-green-700 dark:text-green-400">
            All Raspberry Pis should now be accessible via SSH with static IPs. You're ready to install K3s!
          </p>
        </div>
      </div>
    </div>
  )
}
