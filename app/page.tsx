import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background px-6 py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <span className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          Atlas AI Platform
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Build AI-powered experiences with production-ready infrastructure.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Manage API access, monitor usage, and experiment with our large language model from a single secure dashboard designed for developer workflows.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Create a developer account
          </Link>
          <Link
            href="/signin"
            className="inline-flex h-11 items-center justify-center rounded-md border border-input px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Sign in
          </Link>
        </div>
        <dl className="mt-16 grid w-full grid-cols-1 gap-6 rounded-lg border border-border bg-card p-6 text-left shadow-sm sm:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Latency</dt>
            <dd className="mt-2 text-2xl font-semibold">&lt; 400ms</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Global regions</dt>
            <dd className="mt-2 text-2xl font-semibold">6+</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Guaranteed uptime</dt>
            <dd className="mt-2 text-2xl font-semibold">99.9%</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
