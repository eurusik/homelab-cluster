import PageLayout from '@/layouts/PageLayout'
import { generateMetadata } from '@/lib/metadata'
import { listPosts } from '@/lib/blogDb'

export const metadata = generateMetadata({
  title: 'Blog',
  description: 'Updates and news about the homelab cluster.',
  path: '/blog',
  keywords: ['blog', 'news', 'updates', 'cluster'],
})

export const revalidate = 0

async function getPosts() {
  // In dev, read directly from DB for faster updates
  // In production with proper base URL, use API
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_BASE_URL) {
    try {
      const posts = await listPosts()
      return { posts }
    } catch (e) {
      console.error('Failed to list posts:', e)
      return { posts: [] }
    }
  }

  // Production: fetch from API
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const url = `${baseUrl}/api/blog`
    const res = await fetch(url, { next: { revalidate: 10 } })
    if (!res.ok) return { posts: [] }
    return res.json()
  } catch (e) {
    console.error('Failed to fetch posts:', e)
    return { posts: [] }
  }
}

export default async function BlogPage() {
  const { posts } = await getPosts()
  return (
    <PageLayout
      breadcrumb="Blog"
      title="Cluster Blog"
      subtitle="News and updates about @eurusik lab"
    >
      <div className="space-y-6">
        {posts.length === 0 && (
          <div className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-6">
            <p className="text-gray-400 font-mono">No posts yet. Stay tuned!</p>
          </div>
        )}

        {posts.map((post: any) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block border border-[#2a2a2a] bg-[#111111] rounded-lg p-6 hover:border-[#ff8c00] transition-colors"
          >
            <h3 className="text-xl font-semibold text-white font-mono mb-2">{post.title}</h3>
            <p className="text-xs text-gray-500 font-mono mb-3">{new Date(post.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
            {post.excerpt && <p className="text-gray-400 font-mono">{post.excerpt}</p>}
          </a>
        ))}
      </div>
    </PageLayout>
  )
}