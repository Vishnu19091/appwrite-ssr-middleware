import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/server/appwrite";

const protectedRoutes = ["/account", "/api/user"];
const publicRoutes = ["/", "/signup"];

export async function middleware(request) {
  // Get the request path
  const path = request.nextUrl.pathname;

  // Stores Boolean value
  const isProtectedRoute =
    protectedRoutes.includes(path) ||
    protectedRoutes.some((route) => path.startsWith(route.replace("*", "")));

  // Stores Boolean value
  const isPublicRoute = publicRoutes.includes(path);

  // Tries to fetch user data from the appwrite
  const user = await getLoggedInUser(request);

  // Redirect to login if accessing a protected route without a user
  if (isProtectedRoute && !user?.$id) {
    return NextResponse.redirect(new URL("/signup", request.nextUrl));
  }

  // Redirect to dashboard if already logged in and trying to access a public auth page
  if (isPublicRoute && user?.$id && !path.startsWith("/account")) {
    return NextResponse.redirect(new URL("/account", request.nextUrl));
  }

  // console.log(request.cookies.get("appwrite-session"));
  return NextResponse.next();
}

// Specify the paths where the middleware should run (optional, but good for performance)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
