"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [message, setMessage] =
    useState<string | null>(null);

  const [pending, setPending] =
    useState(false);

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage(null);
    setPending(true);

    const form =
      new FormData(
        event.currentTarget,
      );

    const response = await fetch(
      "/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          password:
            form.get("password"),
          confirmPassword:
            form.get(
              "confirmPassword",
            ),
        }),
      },
    );

    const result =
      (await response.json()) as {
        success: boolean;
        error?: string;
      };

    setPending(false);

    if (!result.success) {
      setMessage(
        result.error ===
          "ACCOUNT_EXISTS"
          ? "An account already exists for this email."
          : "Please check the information and try again.",
      );

      return;
    }

    router.push(
      "/login?registered=1",
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">
          Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
        />
      </div>

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
          autoComplete="new-password"
          minLength={12}
          required
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
        >
          Confirm password
        </label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
        />
      </div>

      {message ? (
        <p role="alert">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
      >
        {pending
          ? "Creating..."
          : "Create account"}
      </button>
    </form>
  );
}