"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Enter a valid email address" }),
});

export type ProfileFormValues = z.infer<typeof schema>;

interface ProfileFormProps {
  defaultValues: ProfileFormValues;
}

type StatusState = { type: "success" | "error"; message: string } | null;

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [status, setStatus] = useState<StatusState>(null);
  const { update } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus(null);
    const response = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json().catch(() => ({ message: "Unable to update profile" }));

    if (!response.ok) {
      setStatus({ type: "error", message: data?.message ?? "Unable to update profile" });
      return;
    }

    setStatus({ type: "success", message: "Profile updated successfully" });
    await update({ name: values.name, email: values.email });
    reset(values);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your name" {...register("name")} />
          {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
        </div>
      </div>
      {status ? (
        <p
          className={`text-sm ${
            status.type === "success" ? "text-emerald-600" : "text-destructive"
          }`}
        >
          {status.message}
        </p>
      ) : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
