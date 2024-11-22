import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();

  // Check if the environment is production
  //if (process.env.NODE_ENV === 'production') {
  // Exclude the "under construction" page from redirection
  //if (request.nextUrl.pathname !== '/under-construction') {
  //  redirectUrl.pathname = '/under-construction';
  //  return NextResponse.redirect(redirectUrl);
  //}
  //}

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}