import { withAuth } from "next-auth/middleware";

import { resolveNextAuthSecret } from "./lib/auth-secret";

export default withAuth({
  secret: resolveNextAuthSecret(),
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/playground/:path*",
    "/settings/:path*",
    "/api/keys/:path*",
    "/api/playground/:path*",
    "/api/settings/:path*",
  ],
};
