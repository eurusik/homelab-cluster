import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const UPLOAD_DIR = '/data/uploads'

export async function GET(_req: Request, { params }: { params: { filename: string } }) {
  try {
    const filePath = path.join(UPLOAD_DIR, params.filename)
    const exists = await fs.stat(filePath).then(() => true).catch(() => false)
    if (!exists) return new NextResponse('Not found', { status: 404 })

    const ext = path.extname(params.filename).toLowerCase()
    const mime = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.webp' ? 'image/webp' : 'application/octet-stream'
    const data = await fs.readFile(filePath)
    return new NextResponse(data, { status: 200, headers: { 'Content-Type': mime } })
  } catch {
    return new NextResponse('Error', { status: 500 })
  }
}
