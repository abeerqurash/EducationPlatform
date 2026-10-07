import Link from "next/link";

type CategoryNavigationProps = {
  categories: Array<{
    name: string;
    slug: string;
    toolCount: number;
  }>;
  activeCategory?: string;
};

export function CategoryNavigation({
  categories,
  activeCategory,
}: CategoryNavigationProps) {
  return (
    <nav
      className="tool-category-navigation"
      aria-label="Tool categories"
    >
      <Link
        href="/tools"
        className={
          !activeCategory
            ? "tool-category-pill tool-category-pill--active"
            : "tool-category-pill"
        }
      >
        All tools
      </Link>

      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/tools/${category.slug}`}
          className={
            activeCategory ===
            category.slug
              ? "tool-category-pill tool-category-pill--active"
              : "tool-category-pill"
          }
        >
          {category.name}

          <span>{category.toolCount}</span>
        </Link>
      ))}
    </nav>
  );
}