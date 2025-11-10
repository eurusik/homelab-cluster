# K3s Homelab Documentation & Blog Site

<img width="3386" height="1762" alt="image" src="https://github.com/user-attachments/assets/665a0388-460b-4eaf-91c5-34dc6f922ed3" />

**Demo:** https://homelab.eurusik.tech 


## Prerequisites

- Kubernetes cluster (K3s or similar)
- kubectl configured to access your cluster
- NFS server setup (for persistent storage)
- Docker/container registry access

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/eurusik/homelab-cluster.git
cd homelab-cluster
```

### 2. Create Namespace
```bash
kubectl create namespace homelab-docs
```

### 3. Create Admin Credentials Secret
```bash
kubectl -n homelab-docs create secret generic admin-credentials \
  --from-literal=ADMIN_USER=admin \
  --from-literal=ADMIN_PASS=your_secure_password
```

### 4. Configure NFS Provisioner (if not already installed)

The cluster needs NFS for shared storage across pod replicas.

```bash
kubectl apply -f k8s/nfs-provisioner.yaml
```

Update the NFS server address in the file if needed:
- `NFS_SERVER`: Your NFS server IP
- `NFS_PATH`: Export path on NFS server

### 5. Deploy Application
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

### 6. Verify Deployment
```bash
kubectl get pods -n homelab-docs
kubectl get svc -n homelab-docs
```

All pods should be in Running state.

## Access

- **Blog**: http://your-domain/blog
- **Admin Panel**: http://your-domain/admin/blog
  - Username: `admin`
  - Password: Your configured password from step 3

## Storage

Blog data is persisted using NFS with ReadWriteMany access mode. This allows:
- Data survives pod restarts
- Multiple pod replicas can write simultaneously
- Automatic backups if NFS is configured

## Scaling

To increase replicas:
```bash
kubectl scale deployment homelab-docs -n homelab-docs --replicas=3
```

All replicas share the same NFS storage automatically.

## Local Development

### Setup
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Server runs on http://localhost:3000

### Blog Data
Blog posts are stored in `./.data/blog.db.json` (git-ignored). This mimics the `/data` volume mount in Kubernetes.

### Known Issues

**Blog posts may appear to cache after creation**

Blog pages use SSR caching for performance. After creating a post via admin panel, you may need to restart the Next.js server to see new posts immediately. This will be optimized in future releases with better cache invalidation.

Workaround: Restart Next.js development server or wait for cache to expire.

### Admin Panel
- Access: http://localhost:3000/admin/blog
- Username: admin
- Password: admin (change in environment if needed)

### Environment Variables (Dev)
Create `.env.local`:
```
ADMIN_USER=admin
ADMIN_PASS=admin
```

## Environment Variables (Production)

Configure in deployment.yaml:
- `NODE_ENV`: production
- `NEXT_PUBLIC_BASE_URL`: Your application base URL
- `ADMIN_USER` / `ADMIN_PASS`: From secrets
