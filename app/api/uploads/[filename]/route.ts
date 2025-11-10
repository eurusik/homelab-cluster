import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = process.env.NODE_ENV === 'production' ? '/data' : './.data'
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')

export async function GET(_req: Request, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params
    const filePath = path.join(UPLOAD_DIR, filename)
    const exists = await fs.stat(filePath).then(() => true).catch(() => false)
    if (!exists) return new NextResponse('Not found', { status: 404 })

    const ext = path.extname(filename).toLowerCase()
    const mime = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.webp' ? 'image/webp' : 'application/octet-stream'
    const data = await fs.readFile(filePath)
    return new NextResponse(data, { status: 200, headers: { 'Content-Type': mime } })
  } catch {
    return new NextResponse('Error', { status: 500 })
  }
}
