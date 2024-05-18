import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
    afterAuth(auth, req, evt) {
        // Handle users who aren't authenticated
        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({ returnBackUrl: req.url });
        }
        // Redirect signed in users to organization selection page if they are not active in an organization
        if (
            auth.userId &&
            req.nextUrl.pathname === "/"
        ) {
            return NextResponse.rewrite(new URL('/dashboard', req.url))
        }
        // If the user is signed in and trying to access a protected route, allow them to access route
        if (auth.userId && !auth.isPublicRoute) {
            return NextResponse.next();
        }
        // Allow users visiting public routes to access them
        return NextResponse.next();
    },
    publicRoutes: ["/"],
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};