import { NextResponse } from 'next/server'
import { getPost } from '@/lib/blogDb'

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await getPost(params.slug)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (e) {
    return NextResponse.json({ error: 'Unable to read post' }, { status: 500 })
  }
}
