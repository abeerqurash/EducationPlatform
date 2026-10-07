import Link from "next/link";

import { siteConfig } from "@/config/site";

import {
  ArrowRightIcon,
  BookIcon,
  CalculatorIcon,
  ChartIcon,
  GraduationIcon,
  SparklesIcon,
} from "@/components/ui/icons";

const icons = {
  calculator: CalculatorIcon,
  chart: ChartIcon,
  book: BookIcon,
  graduation: GraduationIcon,
  study: SparklesIcon,
  math: CalculatorIcon,
};

export function Categories() {
  return (
    <section className="section section--soft">
      <div className="site-container">
        <div className="section-heading section-heading--center">
          <span className="section-kicker">
            Explore by category
          </span>

          <h2>
            The right tool for every academic decision.
          </h2>

          <p>
            From everyday calculations to major exam planning,
            find focused tools built around the way students
            actually work.
          </p>
        </div>

        <div className="category-grid">
          {siteConfig.toolCategories.map((category) => {
            const Icon =
              icons[
                category.icon as keyof typeof icons
              ];

            return (
              <Link
                key={category.href}
                href={category.href}
                className="category-card"
              >
                <span className="category-card__icon">
                  <Icon />
                </span>

                <div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>

                <span className="category-card__link">
                  Explore
                  <ArrowRightIcon />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}