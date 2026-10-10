import type { ReactNode } from "react";
import type { Metadata } from 'next';
export const metadata: Metadata = { robots: { index: false, follow: false } };

import { AppLogo } from "@/components/app-shell/app-logo";

import "./auth-workspace.css";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="auth-workspace">
      <section className="auth-workspace__visual" aria-label="Education Platform">
        <div className="auth-workspace__brand">
          <AppLogo />
        </div>

        <div className="auth-workspace__message">
          <span className="auth-workspace__eyebrow">
            SMARTER STUDY TOOLS
          </span>
          <h2>
            Plan better.
            <br />
            Learn with confidence.
          </h2>
          <p>
            Keep your calculators, test-prep progress and academic
            decisions together in one focused workspace.
          </p>
        </div>

        <p className="auth-workspace__note">
          Education Platform · Built for better learning.
        </p>
      </section>

      <section className="auth-workspace__form">
        <div className="auth-workspace__card">
          {children}
        </div>
      </section>
    </main>
  );
}
