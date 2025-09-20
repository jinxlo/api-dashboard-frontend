export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/playground/:path*", "/settings/:path*", "/api/keys/:path*", "/api/playground/:path*", "/api/settings/:path*"],
};
