import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ['/public', '/login', '/signup', '/', '/global'];
const authBlockRoutes = ['/login', '/signup'];

const userRoutes = ['/user'];
const adminRoutes = ['/admin'];

export default function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;
    const pathname = req.nextUrl.pathname;

    const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`) || pathname.endsWith('.svg'));
    const isAuthBlock = authBlockRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
    const isAuthenticated = Boolean(token);

    if (isAuthenticated && isAuthBlock) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    if (isPublic) {
        return NextResponse.next();
    }

    if (!isAuthenticated && !isPublic) {
        return NextResponse.redirect(new URL("/signup", req.url));
    }

    const isUserRoute = userRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    if (role === 'user' && isAdminRoute) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (role === 'admin' && isUserRoute) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|api|.*\\..*).*)'],
};