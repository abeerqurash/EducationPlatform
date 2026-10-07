"use client";

import { usePathname } from "next/navigation";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

const standalonePrefixes = [
  "/admin",
  "/dashboard",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

function isStandaloneRoute(pathname: string) {
  return standalonePrefixes.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(`${prefix}/`),
  );
}

export function SiteChrome({
  position,
}: {
  position: "header" | "footer";
}) {
  const pathname = usePathname();

  if (isStandaloneRoute(pathname)) {
    return null;
  }

  if (position === "footer") {
    return <Footer />;
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
    </>
  );
}
