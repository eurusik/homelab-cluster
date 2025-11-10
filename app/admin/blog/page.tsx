'use client'

import { useState } from 'react'
import PageLayout from '@/layouts/PageLayout'

export default function AdminBlogPage() {
  const [status, setStatus] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('Uploading...')
    const form = e.currentTarget
    const fd = new FormData(form)

    try {
      const res = await fetch('/api/admin/blog', { method: 'POST', body: fd })
      const json = await res.json()
      if (res.ok) {
        setStatus('Saved!')
        form.reset()
      } else {
        setStatus(json.error || 'Error')
      }
    } catch (e) {
      setStatus('Network error')
    }
  }

  return (
    <PageLayout breadcrumb="Admin" title="Write a Blog Post" subtitle="Minimal blog admin">
      <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm text-gray-300 font-mono mb-1">Title</label>
          <input name="title" required className="w-full bg-[#111111] border border-[#2a2a2a] rounded p-2 text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 font-mono mb-1">Slug</label>
          <input name="slug" required className="w-full bg-[#111111] border border-[#2a2a2a] rounded p-2 text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 font-mono mb-1">Excerpt</label>
          <input name="excerpt" className="w-full bg-[#111111] border border-[#2a2a2a] rounded p-2 text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 font-mono mb-1">Image</label>
          <input name="image" type="file" accept="image/*" className="w-full" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 font-mono mb-1">Content</label>
          <textarea name="content" required rows={8} className="w-full bg-[#111111] border border-[#2a2a2a] rounded p-2 text-white" />
        </div>
        <button className="px-4 py-2 bg-[#ff8c00] text-black font-mono rounded">Publish</button>
        {status && <p className="text-sm text-gray-400 font-mono">{status}</p>}
      </form>
    </PageLayout>
  )
}
