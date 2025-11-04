import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/config'

export const runtime = 'edge'
export const alt = siteConfig.ogImage.alt
export const size = {
  width: siteConfig.ogImage.width,
  height: siteConfig.ogImage.height,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'monospace',
        }}
      >
        {/* Orange accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: '#ff8c00',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '20px',
            }}
          >
            K3s Homelab
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '40px',
              color: '#ff8c00',
              marginBottom: '40px',
            }}
          >
            Raspberry Pi K3s Cluster
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '28px',
              color: '#999999',
              maxWidth: '900px',
              lineHeight: 1.4,
            }}
          >
            Complete guide to building a production-ready Kubernetes homelab
            with Raspberry Pi hardware
          </div>
        </div>

        {/* Bottom tech stack */}
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            display: 'flex',
            gap: '30px',
            fontSize: '24px',
            color: '#666666',
          }}
        >
          <span>K3s</span>
          <span>•</span>
          <span>Kubernetes</span>
          <span>•</span>
          <span>Raspberry Pi</span>
          <span>•</span>
          <span>DevOps</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
