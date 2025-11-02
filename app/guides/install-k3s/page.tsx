export default function InstallK3sPage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold mb-4 dark:text-white">Install K3s</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Deploy K3s Kubernetes on your Raspberry Pi cluster.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Step 1: Install K3s on Master Node</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="mb-4 text-gray-700 dark:text-gray-300">SSH into the master node (192.168.1.101):</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
              <div>ssh pi@192.168.1.101</div>
            </div>

            <p className="mb-4 text-gray-700 dark:text-gray-300">Install K3s server:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
              <div>curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644</div>
            </div>

            <p className="mb-4 text-gray-700 dark:text-gray-300">Verify installation:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
              <div>sudo kubectl get nodes</div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              ⏱️ Installation takes 2-5 minutes. You should see the master node in Ready status.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Step 2: Get Node Token</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="mb-4 text-gray-700 dark:text-gray-300">On the master node, retrieve the token:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
              <div>sudo cat /var/lib/rancher/k3s/server/node-token</div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💾 Copy this token - you'll need it for joining worker nodes.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Step 3: Join Worker Nodes</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="mb-4 text-gray-700 dark:text-gray-300">SSH into each worker node and run:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
              <div>curl -sfL https://get.k3s.io | K3S_URL=https://192.168.1.101:6443 \</div>
              <div>  K3S_TOKEN=YOUR_TOKEN_HERE sh -</div>
            </div>

            <p className="mb-4 text-gray-700 dark:text-gray-300">Replace YOUR_TOKEN_HERE with the token from Step 2.</p>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Repeat for all worker nodes:</p>
              <ul className="list-disc list-inside mt-2 text-sm text-blue-700 dark:text-blue-400">
                <li>k3s-worker-1 (192.168.1.102)</li>
                <li>k3s-worker-2 (192.168.1.103)</li>
                <li>k3s-worker-3 (192.168.1.104)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Step 4: Verify Cluster</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="mb-4 text-gray-700 dark:text-gray-300">On the master node, check all nodes:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
              <div>sudo kubectl get nodes -o wide</div>
            </div>

            <p className="mb-4 text-gray-700 dark:text-gray-300">Expected output:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs overflow-x-auto">
              <div>NAME           STATUS   ROLES                  AGE   VERSION</div>
              <div>k3s-master     Ready    control-plane,master   5m    v1.27.3+k3s1</div>
              <div>k3s-worker-1   Ready    &lt;none&gt;                 3m    v1.27.3+k3s1</div>
              <div>k3s-worker-2   Ready    &lt;none&gt;                 2m    v1.27.3+k3s1</div>
              <div>k3s-worker-3   Ready    &lt;none&gt;                 1m    v1.27.3+k3s1</div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Step 5: Configure kubectl (Optional)</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="mb-4 text-gray-700 dark:text-gray-300">To manage the cluster from your local machine:</p>
            
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">1. Copy kubeconfig from master:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
              <div>scp pi@192.168.1.101:/etc/rancher/k3s/k3s.yaml ~/.kube/config</div>
            </div>

            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">2. Edit the server address:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
              <div>sed -i 's/127.0.0.1/192.168.1.101/' ~/.kube/config</div>
            </div>

            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">3. Test connection:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <div>kubectl get nodes</div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Step 6: Deploy Test Application</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="mb-4 text-gray-700 dark:text-gray-300">Test your cluster with a simple nginx deployment:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
              <div>kubectl create deployment nginx --image=nginx</div>
              <div>kubectl expose deployment nginx --port=80 --type=LoadBalancer</div>
              <div>kubectl get services</div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              🎉 If you see the nginx service with an external IP, your cluster is working!
            </p>
          </div>
        </section>

        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">🎊 Congratulations!</h3>
          <p className="text-green-700 dark:text-green-400 mb-2">
            Your K3s cluster is now fully operational. You can now:
          </p>
          <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-400 space-y-1">
            <li>Deploy containerized applications</li>
            <li>Experiment with Kubernetes features</li>
            <li>Set up monitoring and logging</li>
            <li>Configure persistent storage</li>
            <li>Install additional tools like Helm, ArgoCD, etc.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
