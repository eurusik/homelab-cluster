'use client'

import { useState } from 'react'
import PageLayout from '@/layouts/PageLayout'

export default function AdminLoginPage() {
  const [status, setStatus] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('Signing in...')
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', body: fd })
      const json = await res.json()
      if (res.ok && json.ok) {
        setStatus('Success! Redirecting...')
        setTimeout(() => {
          window.location.href = '/admin/blog'
        }, 500)
      } else {
        setStatus(json.error || 'Invalid credentials')
      }
    } catch {
      setStatus('Network error')
    }
  }

  return (
    <PageLayout breadcrumb="Admin" title="Admin Login" subtitle="Restricted area">
      <form onSubmit={onSubmit} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-sm text-gray-300 font-mono mb-1">Username</label>
          <input name="username" required className="w-full bg-[#111111] border border-[#2a2a2a] rounded p-2 text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 font-mono mb-1">Password</label>
          <input name="password" type="password" required className="w-full bg-[#111111] border border-[#2a2a2a] rounded p-2 text-white" />
        </div>
        <button className="px-4 py-2 bg-[#ff8c00] text-black font-mono rounded">Sign in</button>
        {status && <p className="text-sm text-gray-400 font-mono">{status}</p>}
      </form>
    </PageLayout>
  )
}
