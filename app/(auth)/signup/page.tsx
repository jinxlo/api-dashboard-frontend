import { Metadata } from "next";

import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create account | Atlas AI Platform",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
