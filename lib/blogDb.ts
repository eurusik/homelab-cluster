import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt?: string
  content: string
  image?: string
  images?: string[]
}

interface BlogDbSchema {
  posts: BlogPost[]
}

const DATA_DIR = process.env.NODE_ENV === 'production' ? '/data' : './.data'
const DB_PATH = path.join(DATA_DIR, 'blog.db.json')

let db: Low<BlogDbSchema> | null = null

export async function getDb() {
  if (!db) {
    const adapter = new JSONFile<BlogDbSchema>(DB_PATH)
    db = new Low<BlogDbSchema>(adapter, { posts: [] })
    await db.read()
    db.data ||= { posts: [] }
  }
  return db
}

export async function listPosts(): Promise<BlogPost[]> {
  const db = await getDb()
  return [...(db.data!.posts || [])].sort((a, b) => (a.date > b.date ? -1 : 1))
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const db = await getDb()
  return db.data!.posts.find((p: BlogPost) => p.slug === slug)
}

export async function savePost(post: BlogPost): Promise<void> {
  const db = await getDb()
  const idx = db.data!.posts.findIndex((p: BlogPost) => p.slug === post.slug)
  if (idx >= 0) {
    console.log(`Updating post: ${post.slug}`)
    db.data!.posts[idx] = post
  } else {
    console.log(`Creating post: ${post.slug}`)
    db.data!.posts.push(post)
  }
  await db.write()
  console.log(`Post saved: ${post.slug}`)
}

export function clearDbCache(): void {
  db = null
}
