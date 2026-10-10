import {
  and,
  asc,
  eq,
} from "drizzle-orm";
import { getToolPageKeys, getToolPage } from './tool-pages';
import { publicToolPaths } from '@/lib/public/routes';

import {
  db,
  toolCategories,
  tools,
} from "@education/database";

export type PublicTool = {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  description: string;
  access: "free" | "premium";
  featured: boolean;
  status: "published";
};

export type PublicToolCategory = {
  name: string;
  slug: string;
  description: string;
  toolCount: number;
};

const fallbackTools: PublicTool[] = [
  {
    id: "fallback-gpa-calculator",
    name: "GPA Calculator",
    slug: "gpa-calculator",
    categoryName: "GPA Calculators",
    categorySlug: "gpa",
    description:
      "Calculate your GPA and understand your academic performance.",
    access: "free",
    featured: true,
    status: "published",
  },
  {
    id: "fallback-grade-calculator",
    name: "Grade Calculator",
    slug: "grade-calculator",
    categoryName: "Grade Calculators",
    categorySlug: "grades",
    description:
      "Calculate weighted grades and find the score you need on upcoming work.",
    access: "free",
    featured: true,
    status: "published",
  },
  {
    id: "fallback-final-grade-calculator",
    name: "Final Grade Calculator",
    slug: "final-grade-calculator",
    categoryName: "Grade Calculators",
    categorySlug: "grades",
    description:
      "Find the final-exam score required to reach your target course grade.",
    access: "free",
    featured: false,
    status: "published",
  },
  {
    id: "fallback-percentage-calculator",
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    categoryName: "Math Tools",
    categorySlug: "math",
    description:
      "Solve common percentage increases, decreases and proportions.",
    access: "free",
    featured: true,
    status: "published",
  },
  {
    id: "fallback-average-calculator",
    name: "Average Calculator",
    slug: "average-calculator",
    categoryName: "Math Tools",
    categorySlug: "math",
    description:
      "Calculate arithmetic averages quickly from a set of values.",
    access: "free",
    featured: false,
    status: "published",
  },

  /*
   * This is the implemented Digital SAT
   * calculator.
   *
   * Keep its slug synchronized with:
   *
   * /tools/test-prep/
   * digital-sat-score-calculator
   */
  {
    id:
      "fallback-digital-sat-score-calculator",

    name:
      "Digital SAT Score Calculator",

    slug:
      "digital-sat-score-calculator",

    categoryName:
      "Test Prep",

    categorySlug:
      "test-prep",

    description:
      "Estimate Digital SAT Reading and Writing, Math and total score ranges.",

    access:
      "free",

    featured:
      true,

    status:
      "published",
  },

  /*
   * ACT remains discoverable as a
   * planned/fallback tool until its
   * production calculator is added.
   */
  {
    id:
      "fallback-act-score-calculator",

    name:
      "ACT Score Calculator",

    slug:
      "act-score-calculator",

    categoryName:
      "Test Prep",

    categorySlug:
      "test-prep",

    description:
      "Estimate your ACT composite score and section performance.",

    access:
      "free",

    featured:
      false,

    status:
      "published",
  },
  {
    id:
      "fallback-study-time-planner",

    name:
      "Study Time Planner",

    slug:
      "study-time-planner",

    categoryName:
      "Study Tools",

    categorySlug:
      "study",

    description:
      "Turn subjects, deadlines and available hours into a practical study plan.",

    access:
      "free",

    featured:
      false,

    status:
      "published",
  },
  {
    id:
      "fallback-application-checklist",

    name:
      "Application Checklist",

    slug:
      "application-checklist",

    categoryName:
      "Admissions",

    categorySlug:
      "admissions",

    description:
      "Track application preparation and download your checklist.",

    access:
      "free",

    featured:
      false,

    status:
      "published",
  },
];

const fallbackCategoryDescriptions:
  Record<string, string> = {
    gpa:
      "GPA calculation and academic performance planning tools.",

    grades:
      "Grade, weighted-score and target-grade calculators.",

    math:
      "Fast calculators for common mathematical problems.",

    "test-prep":
      "Score calculators and planning tools for major exams.",

    study:
      "Planning, productivity and learning-support tools.",

    admissions:
      "Tools for applications, requirements and admission planning.",
  };

function normalizeSearch(
  value?: string,
) {
  return (
    value
      ?.trim()
      .slice(0, 100) ??
    ""
  );
}

function toolKey(
  tool: Pick<
    PublicTool,
    "categorySlug" | "slug"
  >,
) {
  return `${tool.categorySlug}/${tool.slug}`;
}

function matchesFilters(
  tool: PublicTool,
  options: {
    query: string;
    category: string;
    access?:
      | "free"
      | "premium";
  },
) {
  const {
    query,
    category,
    access,
  } = options;

  if (
    category &&
    tool.categorySlug !== category
  ) {
    return false;
  }

  if (
    access &&
    tool.access !== access
  ) {
    return false;
  }

  if (!query) {
    return true;
  }

  const searchable = [
    tool.name,
    tool.description,
    tool.categoryName,
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(
    query.toLowerCase(),
  );
}

function mergeTools(
  fallback: PublicTool[],
  database: PublicTool[],
) {
  /*
   * Start with fallback tools.
   *
   * Database records then replace the
   * corresponding fallback record using
   * category + slug as the stable public
   * identity.
   */
  const merged =
    new Map<
      string,
      PublicTool
    >();

  for (const tool of fallback) {
    merged.set(
      toolKey(tool),
      tool,
    );
  }

  for (const tool of database) {
    merged.set(
      toolKey(tool),
      tool,
    );
  }

  return Array.from(
    merged.values(),
  );
}

export async function getPublicTools(
  options?: {
    query?: string;

    category?: string;

    access?:
      | "free"
      | "premium";
  },
) {
  const query =
    normalizeSearch(
      options?.query,
    );

  const category =
    options?.category
      ?.trim() ?? "";

  const access =
    options?.access;

  /*
   * Fetch all published DB tools first.
   *
   * Filtering is intentionally performed
   * after DB + fallback merging so both
   * sources follow identical behavior.
   */
  let databaseTools:
    PublicTool[] = [];

  try {
    const rows =
      await db
        .select({
          id:
            tools.id,

          name:
            tools.name,

          slug:
            tools.slug,

          description:
            tools.shortDescription,

          access:
            tools.access,

          featured:
            tools.isFeatured,

          categoryName:
            toolCategories.name,

          categorySlug:
            toolCategories.slug,
        })
        .from(tools)
        .innerJoin(
          toolCategories,

          eq(
            tools.categoryId,
            toolCategories.id,
          ),
        )
        .where(
          and(
            eq(
              tools.status,
              "published",
            ),

            eq(
              tools.isArchived,
              false,
            ),

            eq(
              toolCategories.isArchived,
              false,
            ),

            eq(
              toolCategories.isActive,
              true,
            ),
          ),
        )
        .orderBy(
          asc(
            toolCategories.sortOrder,
          ),

          asc(
            tools.name,
          ),
        );

    databaseTools =
      rows.map(
        (
          row,
        ): PublicTool => ({
          id:
            row.id,

          name:
            row.name,

          slug:
            row.slug,

          categoryName:
            row.categoryName,

          categorySlug:
            row.categorySlug,

          description:
            row.description ??
            `${row.name} for students and learners.`,

          access:
            row.access,

          featured:
            row.featured,

          status:
            "published",
        }),
      );
  } catch (error) {
    if (
      process.env.NODE_ENV ===
      "development"
    ) {
      console.error(
        "Unable to load public tools from database:",
        error,
      );
    }
  }

  const implemented = new Set(publicToolPaths());
  const generated = getToolPageKeys().flatMap(key => {
    const [category, slug] = key.split('/');
    if (!category || !slug) return [];
    const page = getToolPage(category, slug);
    if (!page) return [];
    return [{ id: `fallback-${slug}`, name: page.name, slug, categorySlug: category, categoryName: fallbackTools.find(t => t.categorySlug === category)?.categoryName ?? category, description: page.description, access: 'free' as const, featured: false, status: 'published' as const }];
  });
  const merged =
    mergeTools(
      mergeTools(generated, fallbackTools),
      databaseTools,
    );

  return merged
    .filter(tool => implemented.has(`/tools/${tool.categorySlug}/${tool.slug}`))
    .filter((tool) =>
      matchesFilters(
        tool,
        {
          query,
          category,
          access,
        },
      ),
    )
    .sort(
      (a, b) => {
        const categoryCompare =
          a.categoryName.localeCompare(
            b.categoryName,
          );

        if (
          categoryCompare !== 0
        ) {
          return categoryCompare;
        }

        return a.name.localeCompare(
          b.name,
        );
      },
    );
}

export async function getPublicToolCategories() {
  const allTools =
    await getPublicTools();

  const categories =
    new Map<
      string,
      PublicToolCategory
    >();

  for (
    const tool
    of allTools
  ) {
    const existing =
      categories.get(
        tool.categorySlug,
      );

    if (existing) {
      existing.toolCount += 1;
      continue;
    }

    categories.set(
      tool.categorySlug,
      {
        name:
          tool.categoryName,

        slug:
          tool.categorySlug,

        description:
          fallbackCategoryDescriptions[
            tool.categorySlug
          ] ??
          `Explore ${tool.categoryName.toLowerCase()}.`,

        toolCount:
          1,
      },
    );
  }

  return Array.from(
    categories.values(),
  );
}

export async function getPublicToolCategory(
  slug: string,
) {
  const categories =
    await getPublicToolCategories();

  return (
    categories.find(
      (category) =>
        category.slug ===
        slug,
    ) ?? null
  );
}
