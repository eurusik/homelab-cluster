import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow login routes
  const isLoginPage = pathname.startsWith('/admin/login')
  const isLoginApi = pathname.startsWith('/api/admin/login')
  if (isLoginPage || isLoginApi) {
    return NextResponse.next()
  }

  // Check cookie
  const auth = req.cookies.get('admin_auth')?.value
  if (auth === '1') {
    return NextResponse.next()
  }

  // Redirect to login
  const url = req.nextUrl.clone()
  url.pathname = '/admin/login'
  return NextResponse.redirect(url)
}
