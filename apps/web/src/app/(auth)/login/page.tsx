import {
  redirect,
} from "next/navigation";

import { auth } from "@/auth";

import LoginForm from "./login-form";

export const metadata = {
  title: "Sign In",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main>
      <h1>Sign in</h1>

      <LoginForm />

      <p>
        Don&apos;t have an account?{" "}
        <a href="/register">
          Create one
        </a>
      </p>
    </main>
  );
}