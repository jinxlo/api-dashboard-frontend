import { Metadata } from "next";

import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in | Atlas AI Platform",
};

export default function SignInPage() {
  return <SignInForm />;
}
