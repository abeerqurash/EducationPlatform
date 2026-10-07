import Link from "next/link";

import { ToolSearch } from "./tool-search";
import {
  ArrowRightIcon,
  CheckIcon,
  SparklesIcon,
} from "@/components/ui/icons";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-decoration hero-decoration--one" />
      <div className="hero-decoration hero-decoration--two" />

      <div className="site-container hero__inner">
        <div className="hero__content">
          <div className="eyebrow">
            <SparklesIcon />
            Built for smarter learning
          </div>

          <h1>
            One place to{" "}
            <span>calculate, prepare</span>{" "}
            and learn better.
          </h1>

          <p className="hero__description">
            Accurate education calculators, test-prep tools,
            admissions resources and intelligent study support
            designed to help you make better academic decisions.
          </p>

          <ToolSearch />

          <div className="hero__actions">
            <Link
              href="/tools"
              className="button button--primary button--large"
            >
              Explore all tools
              <ArrowRightIcon />
            </Link>

            <Link
              href="/test-prep"
              className="button button--secondary button--large"
            >
              Explore test prep
            </Link>
          </div>

          <div className="hero__trust">
            <span>
              <CheckIcon />
              Free tools
            </span>

            <span>
              <CheckIcon />
              No signup required
            </span>

            <span>
              <CheckIcon />
              Student focused
            </span>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-card hero-card--main">
            <div className="hero-card__top">
              <span>Academic progress</span>
              <span className="status-pill">On track</span>
            </div>

            <div className="score-ring">
              <div>
                <strong>3.82</strong>
                <span>GPA</span>
              </div>
            </div>

            <div className="mini-bars">
              <span style={{ height: "48%" }} />
              <span style={{ height: "68%" }} />
              <span style={{ height: "57%" }} />
              <span style={{ height: "82%" }} />
              <span style={{ height: "72%" }} />
              <span style={{ height: "94%" }} />
            </div>
          </div>

          <div className="floating-card floating-card--score">
            <span>Target score</span>
            <strong>1450+</strong>
            <small>SAT goal</small>
          </div>

          <div className="floating-card floating-card--study">
            <span className="floating-card__icon">
              <SparklesIcon />
            </span>

            <div>
              <strong>Study smarter</strong>
              <small>Personalized insights</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}