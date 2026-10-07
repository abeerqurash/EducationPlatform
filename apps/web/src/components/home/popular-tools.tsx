import Link from "next/link";

import { siteConfig } from "@/config/site";
import {
  ArrowUpRightIcon,
  CalculatorIcon,
} from "@/components/ui/icons";

export function PopularTools() {
  return (
    <section className="section">
      <div className="site-container">
        <div className="section-heading section-heading--split">
          <div>
            <span className="section-kicker">
              Popular tools
            </span>

            <h2>
              Start with what students use most.
            </h2>
          </div>

          <Link href="/tools" className="text-link">
            View all tools
            <ArrowUpRightIcon />
          </Link>
        </div>

        <div className="tool-grid">
          {siteConfig.popularTools.map((tool, index) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="tool-card"
            >
              <div className="tool-card__header">
                <span className="tool-card__icon">
                  <CalculatorIcon />
                </span>

                <ArrowUpRightIcon className="tool-card__arrow" />
              </div>

              <span className="tool-card__category">
                {tool.category}
              </span>

              <h3>{tool.name}</h3>

              <p>{tool.description}</p>

              <span className="tool-card__number">
                0{index + 1}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}