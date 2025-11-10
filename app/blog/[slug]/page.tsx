import PageLayout from '@/layouts/PageLayout'
import { generateMetadata as genMeta } from '@/lib/metadata'

async function getPost(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  const res = await fetch(`${baseUrl}/api/blog/${slug}`, { next: { revalidate: 10 } })
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  const title = post ? `${post.title} — Blog` : 'Blog Post — Not Found'
  const description = post ? String(post.excerpt || post.content).slice(0, 140) : 'Blog post not found.'

  return genMeta({
    title,
    description,
    path: `/blog/${params.slug}`,
    keywords: ['blog', 'news', 'updates', 'cluster'],
  })
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    return (
      <PageLayout breadcrumb="Blog" title="Post Not Found">
        <div className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-6">
          <p className="text-gray-400 font-mono">The requested blog post was not found.</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout breadcrumb="Blog" title={post.title} subtitle={new Date(post.date).toLocaleDateString()}>
      {post.image && (
        <img src={post.image} alt={post.title} className="w-full max-w-2xl rounded mb-6 border border-[#2a2a2a]" />
      )}
      <article className="prose prose-invert max-w-none">
        <p className="text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </article>
    </PageLayout>
  )}
