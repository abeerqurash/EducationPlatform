import Link from "next/link";

import { MobileNavigation } from "./mobile-navigation";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-container site-header__inner">
        <Link
          href="/"
          className="brand"
          aria-label={`${siteConfig.name} home`}
        >
          <span className="brand__mark" aria-hidden="true">
            E
          </span>

          <span className="brand__name">
            Education
            <span>Platform</span>
          </span>
        </Link>

        <nav
          className="desktop-navigation"
          aria-label="Main navigation"
        >
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link
            href="/login"
            className="header-sign-in"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="button button--primary button--small"
          >
            Get started
          </Link>
        </div>

        <MobileNavigation />
      </div>
    </header>
  );
}