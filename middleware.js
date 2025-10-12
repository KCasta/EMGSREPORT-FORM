import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

export function middleware(req) {
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  const url = req.nextUrl.pathname;

  // Define protected routes by role
  const protectedPaths = {
    worker: ["/workers"],
    leader: ["/leaders"],
  };

  // Check if current path is protected
  const isProtected = Object.values(protectedPaths)
    .flat()
    .some((path) => url.startsWith(path));

  // ⛔ No token → redirect to signin
  if (isProtected && !token) {
    const signinUrl = new URL("/signin", req.url);
    signinUrl.searchParams.set("redirect", url); // optional: return user back later
    return NextResponse.redirect(signinUrl);
  }

  // ✅ If token exists, verify it
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const role = decoded.role;

      // 🚫 Role mismatch redirect
      if (url.startsWith("/leaders") && role !== "leader") {
        return NextResponse.redirect(new URL("/workers", req.url));
      }

      if (url.startsWith("/workers") && role !== "worker") {
        return NextResponse.redirect(new URL("/leaders", req.url));
      }
    } catch (err) {
      console.error("❌ Invalid token:", err);
      const signinUrl = new URL("/signin", req.url);
      return NextResponse.redirect(signinUrl);
    }
  }

  // ✅ Everything good → continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/workers/:path*", "/leaders/:path*"],
};
