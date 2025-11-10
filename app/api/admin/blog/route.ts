import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { savePost, getPost, listPosts, clearDbCache } from '@/lib/blogDb'

const DATA_DIR = process.env.NODE_ENV === 'production' ? '/data' : './.data'
const BLOG_DIR = path.join(DATA_DIR, 'blog')
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const title = String(form.get('title') || '').trim()
    let slug = String(form.get('slug') || '').trim()
    const content = String(form.get('content') || '').trim()
    const date = String(form.get('date') || new Date().toISOString().slice(0, 10))
    const excerpt = String(form.get('excerpt') || '')
    const image = form.get('image') as File | null

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Auto-generate slug if missing
    if (!slug) {
      const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      slug = baseSlug || `post-${Date.now()}`
    }
    // Ensure uniqueness
    if (await getPost(slug)) {
      const base = slug
      let i = 2
      while (await getPost(`${base}-${i}`)) i++
      slug = `${base}-${i}`
    }

    await fs.mkdir(BLOG_DIR, { recursive: true })
    await fs.mkdir(UPLOAD_DIR, { recursive: true })

    let imagePath: string | undefined
    const images: string[] = []
    
    if (image && image.size > 0) {
      try {
        const arrayBuffer = await image.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const safeName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9._-]/g, '')}`
        const full = path.join(UPLOAD_DIR, safeName)
        await fs.writeFile(full, buffer)
        imagePath = `/api/uploads/${safeName}`
        images.push(imagePath)
      } catch (err) {
        console.error('Error processing featured image:', err)
      }
    }
    
    // Handle multiple images
    const formImages = form.getAll('images')
    for (const img of formImages) {
      if (img && typeof img === 'object' && 'size' in img && (img as any).size > 0) {
        try {
          const arrayBuffer = await (img as any).arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const safeName = `${Date.now()}-${Math.random()}-${(img as any).name.replace(/[^a-zA-Z0-9._-]/g, '')}`
          const full = path.join(UPLOAD_DIR, safeName)
          await fs.writeFile(full, buffer)
          const imgPath = `/api/uploads/${safeName}`
          images.push(imgPath)
        } catch (err) {
          console.error('Error processing gallery image:', err)
        }
      }
    }

    const post = { slug, title, date, excerpt, content, image: imagePath, images: images.length > 0 ? images : undefined }
    await savePost(post)
    clearDbCache() // Clear cache so next fetch gets fresh data
    revalidatePath('/blog') // Revalidate SSR cache
    revalidatePath(`/blog/${slug}`) // Revalidate post detail page

    return NextResponse.json({ ok: true, post })
  } catch (e) {
    console.error('Blog save error:', e)
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const slug = url.searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 })
    }

    const post = await getPost(slug)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Remove post from DB
    const allPosts = await listPosts()
    const updated = { posts: allPosts.filter((p: any) => p.slug !== slug) }
    const DATA_DIR = process.env.NODE_ENV === 'production' ? '/data' : './.data'
    const DB_PATH = path.join(DATA_DIR, 'blog.db.json')
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2), 'utf-8')
    console.log(`Post deleted: ${slug}`)

    // Delete image if exists
    if (post.image) {
      const match = post.image.match(/\/api\/uploads\/([^/]+)$/)
      if (match) {
        const filename = match[1]
        const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')
        const filepath = path.join(UPLOAD_DIR, filename)
        await fs.unlink(filepath).catch(() => {})
      }
    }

    clearDbCache() // Clear cache after delete
    revalidatePath('/blog') // Revalidate SSR cache
    revalidatePath(`/blog/${slug}`) // Revalidate post detail page
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Blog delete error:', e)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
