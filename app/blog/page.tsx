import PageLayout from '@/layouts/PageLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Blog',
  description: 'Updates and news about the homelab cluster.',
  path: '/blog',
  keywords: ['blog', 'news', 'updates', 'cluster'],
})

export const revalidate = 10

async function getPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  const url = `${baseUrl}/api/blog`
  const res = await fetch(url, { next: { revalidate: 10 } })
  if (!res.ok) return { posts: [] }
  return res.json()
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
            <p className="text-xs text-gray-500 font-mono mb-3">{new Date(post.date).toLocaleDateString()}</p>
            {post.excerpt && <p className="text-gray-400 font-mono">{post.excerpt}</p>}
          </a>
        ))}
      </div>
    </PageLayout>
  )
}