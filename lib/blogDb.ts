import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt?: string
  content: string
  image?: string
}

interface BlogDbSchema {
  posts: BlogPost[]
}

const DB_PATH = '/data/blog.db.json'

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
  if (idx >= 0) db.data!.posts[idx] = post
  else db.data!.posts.push(post)
  await db.write()
}
