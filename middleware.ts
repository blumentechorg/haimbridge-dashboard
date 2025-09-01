import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	
	// Only handle specific routes, not all routes
	if (pathname.startsWith("/dashboard")) {
		// Check for auth token
		const token = request.cookies.get("auth_token")?.value || 
					 request.headers.get("authorization")?.replace("Bearer ", "");
		
		// If no token, redirect to login
		if (!token) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	// Handle login page redirect if already authenticated
	if (pathname === "/login") {
		const token = request.cookies.get("auth_token")?.value || 
					 request.headers.get("authorization")?.replace("Bearer ", "");
		
		// If token exists, redirect to dashboard
		if (token) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}

	// Handle root path redirect to login
	if (pathname === "/") {
		const token = request.cookies.get("auth_token")?.value || 
					 request.headers.get("authorization")?.replace("Bearer ", "");
		
		// If no token, redirect to login, otherwise to dashboard
		if (!token) {
			return NextResponse.redirect(new URL("/login", request.url));
		} else {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/",
		"/login",
		"/dashboard/:path*"
	]
};
