import type { Metadata } from "next";
import Link from "next/link";

import { CategoryNavigation } from "@/components/tools/category-navigation";
import { ToolCard } from "@/components/tools/tool-card";
import { ToolsFilter } from "@/components/tools/tools-filter";

import {
  getPublicToolCategories,
  getPublicTools,
} from "@/lib/tools/catalog";

import {
  ArrowRightIcon,
  SparklesIcon,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  title: "Student Calculators & Education Tools",
  description:
    "Explore free education calculators, GPA and grade tools, test-prep calculators, admissions tools and study resources.",
};

type ToolsPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    access?: string | string[];
  }>;
};

function firstValue(
  value: string | string[] | undefined,
) {
  return Array.isArray(value)
    ? value[0] ?? ""
    : value ?? "";
}

export default async function ToolsPage({
  searchParams,
}: ToolsPageProps) {
  const params = await searchParams;

  const query = firstValue(params.q)
    .trim()
    .slice(0, 100);

  const category = firstValue(
    params.category,
  );

  const rawAccess = firstValue(
    params.access,
  );

  const access =
    rawAccess === "free" ||
    rawAccess === "premium"
      ? rawAccess
      : undefined;

  const [categories, publicTools] =
    await Promise.all([
      getPublicToolCategories(),
      getPublicTools({
        query,
        category,
        access,
      }),
    ]);

  return (
    <main className="tools-page">
      <section className="tools-hero">
        <div className="site-container">
          <div className="tools-hero__content">
            <span className="eyebrow">
              <SparklesIcon />
              Education tools
            </span>

            <h1>
              Find the right tool.
              <span>
                {" "}
                Get a clearer answer.
              </span>
            </h1>

            <p>
              Explore accurate calculators,
              test-prep utilities, admissions
              resources and study tools designed
              around real academic decisions.
            </p>
          </div>

          <ToolsFilter
            query={query}
            category={category}
            access={access ?? ""}
            categories={categories}
          />
        </div>
      </section>

      <section className="tools-directory">
        <div className="site-container">
          <CategoryNavigation
            categories={categories}
            activeCategory={
              category || undefined
            }
          />

          <div className="tools-directory__header">
            <div>
              <span className="section-kicker">
                Tool library
              </span>

              <h2>
                {query
                  ? `Results for “${query}”`
                  : category
                    ? categories.find(
                        (item) =>
                          item.slug ===
                          category,
                      )?.name ??
                      "Tools"
                    : "Explore all tools"}
              </h2>
            </div>

            <p>
              {publicTools.length}{" "}
              {publicTools.length === 1
                ? "tool"
                : "tools"}
            </p>
          </div>

          {publicTools.length > 0 ? (
            <div className="directory-tool-grid">
              {publicTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                />
              ))}
            </div>
          ) : (
            <div className="tools-empty-state">
              <div className="tools-empty-state__icon">
                <SparklesIcon />
              </div>

              <h2>
                No tools matched your search.
              </h2>

              <p>
                Try another keyword or clear
                the current filters.
              </p>

              <Link
                href="/tools"
                className="button button--primary"
              >
                View all tools
                <ArrowRightIcon />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
