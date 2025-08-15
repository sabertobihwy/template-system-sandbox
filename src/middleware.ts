// middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    console.log('✅ middleware 执行：', req.nextUrl.pathname);
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/', // ✅ 显式拦截 /
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};