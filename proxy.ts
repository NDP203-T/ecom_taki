import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Kiểm tra route dashboard
  if (pathname.startsWith('/dashboard')) {
    // Lấy user data từ cookie
    const userDataCookie = request.cookies.get('user_data');
    
    if (!userDataCookie) {
      // Chưa đăng nhập, redirect về signin
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    try {
      const userData = JSON.parse(userDataCookie.value);
      
      // Kiểm tra role
      if (userData.role !== 'admin') {
        // Không phải admin, redirect về home
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      // Cookie không hợp lệ, redirect về signin
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
