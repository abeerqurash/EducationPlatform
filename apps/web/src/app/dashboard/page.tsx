import {
  redirect,
} from "next/navigation";

import {
  auth,
  signOut,
} from "@/auth";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Dashboard</h1>

      <p>
        Signed in as{" "}
        {session.user.email ??
          session.user.name ??
          "User"}
      </p>

      <form
        action={async () => {
          "use server";

          await signOut({
            redirectTo: "/",
          });
        }}
      >
        <button type="submit">
          Sign out
        </button>
      </form>
    </main>
  );
}