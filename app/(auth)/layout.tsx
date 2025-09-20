import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="hidden w-full max-w-md flex-col justify-between bg-gradient-to-br from-primary via-primary/70 to-primary/50 p-10 text-primary-foreground lg:flex">
        <div>
          <Link href="/" className="text-2xl font-semibold">
            Atlas AI Platform
          </Link>
          <p className="mt-6 text-sm text-primary-foreground/80">
            Secure access to production-grade language models, ready for your next application.
          </p>
        </div>
        <div className="text-sm text-primary-foreground/70">
          <p>&ldquo;We built Atlas to give our developers a unified interface for experimentation and production.&rdquo;</p>
          <p className="mt-3 font-semibold text-primary-foreground">Lena Marshall, CTO</p>
        </div>
      </aside>
      <main className="flex flex-1 items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-md space-y-6">{children}</div>
      </main>
    </div>
  );
}
