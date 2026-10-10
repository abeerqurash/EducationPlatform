import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryNavigation } from "@/components/tools/category-navigation";
import { ToolCard } from "@/components/tools/tool-card";

import {
  getPublicToolCategories,
  getPublicToolCategory,
  getPublicTools,
} from "@/lib/tools/catalog";

import {
  ArrowRightIcon,
  SparklesIcon,
} from "@/components/ui/icons";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } =
    await params;

  const category =
    await getPublicToolCategory(
      categorySlug,
    );

  if (!category) {
    return {
      title: "Tool Category",
    };
  }

  return {
    title: `${category.name} — Free Student Tools`,
    description: category.description,
    alternates: { canonical: `/tools/${category.slug}` },
  };
}

export default async function ToolCategoryPage({
  params,
}: CategoryPageProps) {
  const { category: categorySlug } =
    await params;

  const [category, categories] =
    await Promise.all([
      getPublicToolCategory(
        categorySlug,
      ),
      getPublicToolCategories(),
    ]);

  if (!category) {
    notFound();
  }

  const publicTools =
    await getPublicTools({
      category: category.slug,
    });

  return (
    <main className="tools-page">
      <section className="category-hero">
        <div className="site-container">
          <nav
            className="breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/tools">
              Tools
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">
              {category.name}
            </span>
          </nav>

          <div className="category-hero__content">
            <span className="eyebrow">
              <SparklesIcon />
              Tool category
            </span>

            <h1>{category.name}</h1>

            <p>
              {category.description}
            </p>

            <div className="category-hero__meta">
              <span>
                {publicTools.length}{" "}
                {publicTools.length === 1
                  ? "tool"
                  : "tools"}
              </span>

              <span>Free tools available</span>
            </div>
          </div>
        </div>
      </section>

      <section className="tools-directory">
        <div className="site-container">
          <CategoryNavigation
            categories={categories}
            activeCategory={
              category.slug
            }
          />

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
              <h2>
                Tools are coming soon.
              </h2>

              <p>
                Explore the complete tool
                directory in the meantime.
              </p>

              <Link
                href="/tools"
                className="button button--primary"
              >
                Explore tools
                <ArrowRightIcon />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
