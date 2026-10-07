import {
  redirect,
} from "next/navigation";

import { auth } from "@/auth";

import RegisterForm from "./register-form";

export const metadata = {
  title: "Create Account",
};

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main>
      <h1>Create account</h1>

      <RegisterForm />

      <p>
        Already have an account?{" "}
        <a href="/login">
          Sign in
        </a>
      </p>
    </main>
  );
}