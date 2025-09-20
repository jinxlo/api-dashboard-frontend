"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type FormValues = z.infer<typeof schema>;

type SignInFormProps = {
  tone?: "default" | "inverted";
  className?: string;
};

export function SignInForm({ tone = "default", className }: SignInFormProps) {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: searchParams.get("callbackUrl") ?? "/dashboard",
    });

    if (result?.error) {
      setError(result.error);
      return;
    }

    window.location.href = result?.url ?? "/dashboard";
  });

  const labelClass = tone === "inverted" ? "text-white/80" : undefined;
  const inputClass =
    tone === "inverted"
      ? "border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-white/40 focus-visible:ring-offset-0"
      : undefined;
  const helperTextClass = tone === "inverted" ? "text-rose-300" : "text-destructive";
  const footerTextClass = tone === "inverted" ? "text-white/60" : "text-muted-foreground";
  const footerLinkClass = tone === "inverted" ? "text-primary-foreground" : "text-primary";

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className={cn("text-sm", tone === "inverted" ? "text-white/60" : "text-muted-foreground")}>
          Sign in with your developer credentials to access the dashboard.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className={labelClass}>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClass}
            {...register("email")}
          />
          {errors.email ? <p className={cn("text-sm", helperTextClass)}>{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className={labelClass}>
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
            {...register("password")}
          />
          {errors.password ? <p className={cn("text-sm", helperTextClass)}>{errors.password.message}</p> : null}
        </div>
        {error ? <p className={cn("text-sm", helperTextClass)}>{error}</p> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className={cn("text-center text-sm", footerTextClass)}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" className={cn("font-semibold", footerLinkClass)}>
          Create one
        </Link>
      </p>
    </div>
  );
}
