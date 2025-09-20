import Link from "next/link";

import { SignInForm } from "@/components/auth/sign-in-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0">
        <div className="pointer-events-none absolute -left-1/2 top-1/2 h-[640px] w-[640px] -translate-y-1/2 rounded-full bg-primary/40 blur-[140px]" />
        <div className="pointer-events-none absolute -right-1/3 top-20 h-[520px] w-[520px] rounded-full bg-cyan-500/30 blur-[160px]" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-10 text-left text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Trusted developer access
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                A refined gateway into the Atlas intelligence fabric.
              </h1>
              <p className="max-w-xl text-lg text-white/70">
                Control API keys, observe live usage, and orchestrate AI workloads from a secure command center built for modern engineering teams.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <dt className="text-sm uppercase tracking-wide text-white/60">Median latency</dt>
                <dd className="mt-3 text-3xl font-semibold text-white">286ms</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <dt className="text-sm uppercase tracking-wide text-white/60">Regions</dt>
                <dd className="mt-3 text-3xl font-semibold text-white">12 global</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <dt className="text-sm uppercase tracking-wide text-white/60">SLA uptime</dt>
                <dd className="mt-3 text-3xl font-semibold text-white">99.95%</dd>
              </div>
            </dl>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="font-medium text-white">Industry leaders ship with Atlas</span>
              <Separator orientation="vertical" className="h-4 bg-white/20" />
              <div className="flex flex-wrap items-center gap-3 opacity-80">
                <span>Zephyr Labs</span>
                <span>Northwind AI</span>
                <span>NeoCompute</span>
              </div>
            </div>
          </div>
          <Card className="relative border-white/10 bg-slate-950/60 text-white shadow-2xl backdrop-blur">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold">Sign in to Atlas</CardTitle>
              <CardDescription className="text-white/60">
                Access your organization workspace with secure multi-region redundancy.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <SignInForm tone="inverted" />
              <div className="space-y-3 text-sm text-white/60">
                <p>
                  New to Atlas? <Link href="/signup" className="font-semibold text-primary underline underline-offset-4">Request access</Link>
                </p>
                <p className="text-xs text-white/40">
                  By continuing you agree to our <Link href="/legal/terms" className="underline hover:text-white/70">Terms</Link> and <Link href="/legal/privacy" className="underline hover:text-white/70">Privacy Policy</Link>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
