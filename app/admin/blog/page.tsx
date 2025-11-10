'use client'

import { useState, useEffect } from 'react'
import PageLayout from '@/layouts/PageLayout'
import type { BlogPost } from '@/lib/blogDb'

export default function AdminBlogPage() {
  const [status, setStatus] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerptText, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [currentImages, setCurrentImages] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editingSlug, setEditingSlug] = useState<string | null>(null)

  useEffect(() => {
    // Fetch all posts
    fetch('/api/blog')
      .then(r => r.json())
      .then(data => setPosts(data.posts || []))
      .catch(() => setPosts([]))
  }, [])

  const slugify = (s: string) => s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = e.target.value
    setTitle(t)
    if (!editingSlug) setSlug(slugify(t))
  }

  const onEdit = (post: BlogPost) => {
    setEditingSlug(post.slug)
    setTitle(post.title)
    setSlug(post.slug)
    setExcerpt(post.excerpt || '')
    setContent(post.content)
    setCurrentImage(post.image || null)
    setCurrentImages(post.images || [])
  }

  const onDelete = async (postSlug: string) => {
    if (!confirm(`Delete "${postSlug}"?`)) return
    try {
      const res = await fetch(`/api/admin/blog?slug=${postSlug}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts(posts.filter((p: BlogPost) => p.slug !== postSlug))
        setStatus('Deleted!')
      } else {
        setStatus('Delete failed')
      }
    } catch {
      setStatus('Delete error')
    }
  }

  const onCancel = () => {
    setEditingSlug(null)
    setTitle('')
    setSlug('')
    setExcerpt('')
    setContent('')
    setCurrentImage(null)
    setCurrentImages([])
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('Saving...')
    const form = e.currentTarget
    const fd = new FormData(form)
    if (editingSlug) {
      fd.append('originalSlug', editingSlug)
    }

    try {
      const res = await fetch('/api/admin/blog', { method: 'POST', body: fd })
      const json = await res.json()
      if (res.ok) {
        setStatus('Saved!')
        // Refresh posts list
        const listRes = await fetch('/api/blog')
        const listData = await listRes.json()
        setPosts(listData.posts || [])
        form.reset()
        onCancel()
      } else {
        setStatus(json.error || 'Error')
      }
    } catch (e) {
      setStatus('Network error')
    }
  }

  return (
    <PageLayout breadcrumb="Admin" title="Blog Management" subtitle="Manage your blog posts">
      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-[#2a2a2a]">
        <button
          onClick={() => {
            setActiveTab('list')
            onCancel()
          }}
          className={`px-4 py-3 font-mono font-semibold transition-colors ${
            activeTab === 'list'
              ? 'text-[#ff8c00] border-b-2 border-[#ff8c00]'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          📋 All Posts ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-3 font-mono font-semibold transition-colors ${
            activeTab === 'create'
              ? 'text-[#ff8c00] border-b-2 border-[#ff8c00]'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          ✍️ {editingSlug ? 'Edit Post' : 'New Post'}
        </button>
      </div>

      {/* List Tab */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-8 text-center">
              <p className="text-gray-400 font-mono">No posts yet. Create your first one!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.slug} className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-6 hover:border-[#ff8c00]/50 transition-colors overflow-hidden">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  {post.image && (
                    <div className="flex-shrink-0 w-full md:w-48 h-48 overflow-hidden rounded bg-[#0a0a0a]">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white font-mono mb-1">{post.title}</h3>
                    <p className="text-sm text-[#ff8c00] font-mono mb-2 break-all">{post.slug}</p>
                    <p className="text-xs text-gray-500 font-mono mb-3">{new Date(post.date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      {post.images && post.images.length > 0 && (
                      <div className="col-span-full">
                        <p className="text-xs text-gray-400 font-mono mb-2">Gallery ({post.images.length} images)</p>
                        <div className="grid grid-cols-3 gap-2">
                          {post.images.map((imgUrl: string, idx: number) => (
                            <div key={idx} className="w-full h-20 rounded overflow-hidden bg-[#0a0a0a]">
                              <img src={imgUrl} alt={`${post.title} ${idx + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0 md:flex-col">
                    <button
                      onClick={() => {
                        onEdit(post)
                        setActiveTab('create')
                      }}
                      className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono text-sm rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(post.slug)}
                      className="flex-1 md:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-sm rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Tab */}
      {activeTab === 'create' && (
        <div className="max-w-3xl">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white font-mono mb-2">Title *</label>
                <input
                  name="title"
                  value={title}
                  onChange={onTitleChange}
                  required
                  placeholder="e.g., Setting up K3s cluster"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff8c00] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white font-mono mb-2">Slug</label>
                <input
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated from title"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff8c00] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white font-mono mb-2">Excerpt</label>
              <input
                name="excerpt"
                value={excerptText}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the post"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff8c00] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white font-mono mb-2">Featured Image</label>
              {currentImage && (
                <div className="mb-3 p-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg flex gap-3 items-start">
                  <img src={currentImage} alt="Current" className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-mono truncate">Current: {currentImage.split('/').pop()}</p>
                    <button
                      type="button"
                      onClick={() => setCurrentImage(null)}
                      className="text-xs text-red-400 hover:text-red-300 font-mono mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
              <input
                name="image"
                type="file"
                accept="image/*"
                className="w-full text-sm text-gray-400 file:mr-4 file:px-4 file:py-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#ff8c00] file:text-black hover:file:bg-[#ff9f1f] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white font-mono mb-2">Additional Images (multiply select)</label>
              {currentImages.length > 0 && (
                <div className="mb-3 p-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg">
                  <p className="text-xs text-gray-400 font-mono mb-2">Current gallery ({currentImages.length}):</p>
                  <div className="grid grid-cols-4 gap-2">
                    {currentImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-16 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setCurrentImages(currentImages.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded text-red-400 text-xs font-mono transition-opacity"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                className="w-full text-sm text-gray-400 file:mr-4 file:px-4 file:py-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white font-mono mb-2">Content *</label>
              <textarea
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Write your post content here..."
                rows={12}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff8c00] transition-colors font-mono"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-[#ff8c00] hover:bg-[#ff9f1f] text-black font-mono font-semibold rounded-lg transition-colors"
              >
                {editingSlug ? '💾 Update Post' : '✍️ Publish Post'}
              </button>
              {editingSlug && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300 font-mono font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>

            {status && (
              <div className={`p-3 rounded-lg font-mono text-sm ${
                status.includes('Saved') || status.includes('Deleted')
                  ? 'bg-green-900/30 text-green-300 border border-green-800'
                  : 'bg-yellow-900/30 text-yellow-300 border border-yellow-800'
              }`}>
                {status}
              </div>
            )}
          </form>
        </div>
      )}
    </PageLayout>
  )
}
