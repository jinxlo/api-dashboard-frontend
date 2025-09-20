"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useMemo, useState } from "react";
import { Github } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/components/providers/locale-provider";

type FormValues = {
  email: string;
  password: string;
};

type SignInFormProps = {
  tone?: "default" | "inverted";
  className?: string;
  showHeading?: boolean;
};

export function SignInForm({ tone = "default", className, showHeading = true }: SignInFormProps) {
  const searchParams = useSearchParams();
  const t = useTranslations();
  const schema = useMemo(
    () =>
      z.object({
        email: z.string().email({ message: t("auth.errors.email") }),
        password: z.string().min(8, { message: t("auth.errors.password") }),
      }),
    [t],
  );
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
      const message =
        result.error === "Database connection is not configured"
          ? t("auth.errors.database")
          : result.error;
      setError(message || t("auth.errors.generic"));
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
  const dividerClass = tone === "inverted" ? "text-white/50" : "text-muted-foreground";
  const oauthButtonVariant = tone === "inverted" ? "secondary" : "outline";

  const handleOAuth = async (provider: "google" | "github") => {
    setError(null);
    const result = await signIn(provider, {
      redirect: false,
      callbackUrl: searchParams.get("callbackUrl") ?? "/dashboard",
    });

    if (result?.error) {
      const message =
        result.error === "Database connection is not configured"
          ? t("auth.errors.database")
          : result.error;
      setError(message || t("auth.errors.generic"));
      return;
    }

    if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {showHeading ? (
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">{t("auth.welcome")}</h1>
          <p className={cn("text-sm", tone === "inverted" ? "text-white/60" : "text-muted-foreground")}>{t("auth.description")}</p>
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant={oauthButtonVariant}
          className="w-full"
          onClick={() => void handleOAuth("google")}
          disabled={isSubmitting}
        >
          <span className="text-sm font-medium">{t("auth.google")}</span>
        </Button>
        <Button
          type="button"
          variant={oauthButtonVariant}
          className="w-full"
          onClick={() => void handleOAuth("github")}
          disabled={isSubmitting}
        >
          <Github className="mr-2 h-4 w-4" aria-hidden="true" />
          <span className="text-sm font-medium">{t("auth.github")}</span>
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className={cn("text-xs uppercase tracking-[0.3em]", dividerClass)}>{t("auth.oauthDivider")}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className={labelClass}>
            {t("auth.emailLabel")}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            autoComplete="email"
            className={inputClass}
            {...register("email")}
          />
          {errors.email ? <p className={cn("text-sm", helperTextClass)}>{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className={labelClass}>
            {t("auth.passwordLabel")}
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
          {isSubmitting ? t("auth.submitting") : t("auth.submit")}
        </Button>
      </form>
      <p className={cn("text-center text-sm", footerTextClass)}>
        {t("auth.createPrompt")} {" "}
        <Link href="/signup" className={cn("font-semibold", footerLinkClass)}>
          {t("auth.requestAccess")}
        </Link>
      </p>
    </div>
  );
}
