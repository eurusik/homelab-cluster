import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { savePost } from '@/lib/blogDb'

const BLOG_DIR = '/data/blog'
const UPLOAD_DIR = '/data/uploads'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const title = String(form.get('title') || '')
    const slug = String(form.get('slug') || '')
    const content = String(form.get('content') || '')
    const date = String(form.get('date') || new Date().toISOString().slice(0, 10))
    const excerpt = String(form.get('excerpt') || '')
    const image = form.get('image') as File | null

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await fs.mkdir(BLOG_DIR, { recursive: true })
    await fs.mkdir(UPLOAD_DIR, { recursive: true })

    let imagePath: string | undefined
    if (image) {
      const arrayBuffer = await image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const safeName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9._-]/g, '')}`
      const full = path.join(UPLOAD_DIR, safeName)
      await fs.writeFile(full, buffer)
      imagePath = `/api/uploads/${safeName}`
    }

    const post = { slug, title, date, excerpt, content, image: imagePath }
    await savePost(post)

    return NextResponse.json({ ok: true, post })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 })
  }
}
