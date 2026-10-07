import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";

export function FinalCTA() {
  return (
    <section className="section">
      <div className="site-container">
        <div className="final-cta">
          <span className="section-kicker section-kicker--light">
            Start exploring
          </span>

          <h2>
            Make your next academic decision with more clarity.
          </h2>

          <p>
            Explore our growing collection of calculators,
            study tools and test-prep resources.
          </p>

          <div className="final-cta__actions">
            <Link
              href="/tools"
              className="button button--light button--large"
            >
              Explore tools
              <ArrowRightIcon />
            </Link>

            <Link
              href="/register"
              className="button button--ghost-light button--large"
            >
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}