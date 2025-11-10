import { NextResponse } from 'next/server'
import { listPosts } from '@/lib/blogDb'

export const revalidate = 10

export async function GET() {
  try {
    const posts = await listPosts()
    return NextResponse.json({ posts })
  } catch (e) {
    return NextResponse.json({ posts: [], error: 'Unable to read posts' }, { status: 200 })
  }
}
