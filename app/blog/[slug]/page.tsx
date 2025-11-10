import Image from 'next/image'
import PageLayout from '@/layouts/PageLayout'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { getPost as getPostFromDb } from '@/lib/blogDb'
import BlogGallery from '@/components/BlogGallery'

async function getPost(slug: string) {
  // In dev, read directly from DB
  // In production with proper base URL, use API
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_BASE_URL) {
    try {
      return await getPostFromDb(slug)
    } catch (e) {
      console.error('Failed to get post:', e)
      return null
    }
  }

  // Production: fetch from API
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const res = await fetch(`${baseUrl}/api/blog/${slug}`, { next: { revalidate: 10 } })
    if (!res.ok) return null
    return res.json()
  } catch (e) {
    console.error('Failed to fetch post:', e)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  const title = post ? `${post.title} — Blog` : 'Blog Post — Not Found'
  const description = post ? String(post.excerpt || post.content).slice(0, 140) : 'Blog post not found.'

  return genMeta({
    title,
    description,
    path: `/blog/${slug}`,
    keywords: ['blog', 'news', 'updates', 'cluster'],
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

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
    <PageLayout breadcrumb="Blog" title={post.title} subtitle={new Date(post.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}>
      {post.image && (
        <div className="relative w-full max-w-2xl h-auto mb-6">
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={450}
            quality={85}
            priority
            className="rounded border border-[#2a2a2a] w-full h-auto"
          />
        </div>
      )}
      <article className="prose prose-invert max-w-none">
        <p className="text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </article>
      
      {/* Gallery */}
      {post.images && post.images.length > 0 && (
        <div className="mt-8 pt-8 border-t border-[#2a2a2a]">
          <h3 className="text-lg font-semibold text-white font-mono mb-4">Gallery</h3>
          <BlogGallery images={post.images} postTitle={post.title} />
        </div>
      )}
    </PageLayout>
  )}
