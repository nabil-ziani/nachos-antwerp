import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();

  // Exclude the "under construction" page and static assets from redirection
  if (!request.nextUrl.pathname.startsWith('/_next') && 
      !request.nextUrl.pathname.startsWith('/img') && 
      !request.nextUrl.pathname.includes('.') && 
      request.nextUrl.pathname !== '/under-construction') {
    redirectUrl.pathname = '/under-construction';
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}