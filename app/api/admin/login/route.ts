import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const username = String(form.get('username') || '')
    const password = String(form.get('password') || '')

    const expectedUser = process.env.ADMIN_USER || 'admin'
    const expectedPass = process.env.ADMIN_PASS || 'admin'

    if (username !== expectedUser || password !== expectedPass) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_auth', '1', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 12, // 12h
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    return res
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Login failed' }, { status: 500 })
  }
}
