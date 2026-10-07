"use client";

import {
  useState,
} from "react";

import {
  signIn,
} from "next-auth/react";

import {
  useRouter,
} from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [error, setError] =
    useState<string | null>(null);

  const [pending, setPending] =
    useState(false);

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setPending(true);

    const form =
      new FormData(
        event.currentTarget,
      );

    const email = String(
      form.get("email") ?? "",
    );

    const password = String(
      form.get("password") ?? "",
    );

    const result =
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

    setPending(false);

    if (result?.error) {
      setError(
        "Invalid email or password.",
      );

      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {error ? (
        <p role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
      >
        {pending
          ? "Signing in..."
          : "Sign in"}
      </button>

      <p>
        <a href="/forgot-password">
          Forgot password?
        </a>
      </p>
    </form>
  );
}