import Link from "next/link";

import type { PublicTool } from "@/lib/tools/catalog";

import {
  ArrowUpRightIcon,
  CalculatorIcon,
} from "@/components/ui/icons";

type ToolCardProps = {
  tool: PublicTool;
};

export function ToolCard({
  tool,
}: ToolCardProps) {
  return (
    <article className="directory-tool-card">
      <Link
        href={`/tools/${tool.categorySlug}/${tool.slug}`}
        className="directory-tool-card__link"
      >
        <div className="directory-tool-card__top">
          <span className="directory-tool-card__icon">
            <CalculatorIcon />
          </span>

          <span className="directory-tool-card__arrow">
            <ArrowUpRightIcon />
          </span>
        </div>

        <div className="directory-tool-card__meta">
          <span>{tool.categoryName}</span>

          <span
            className={
              tool.access === "premium"
                ? "access-badge access-badge--premium"
                : "access-badge"
            }
          >
            {tool.access === "premium"
              ? "Premium"
              : "Free"}
          </span>
        </div>

        <h2>{tool.name}</h2>

        <p>{tool.description}</p>

        <span className="directory-tool-card__cta">
          Open tool
          <ArrowUpRightIcon />
        </span>
      </Link>
    </article>
  );
}