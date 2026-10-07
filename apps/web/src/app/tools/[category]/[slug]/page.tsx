import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  CalculatorRenderer,
} from "@/components/calculators/calculator-component-registry";
import {
  ToolPageShell,
} from "@/components/tools/tool-page-shell";
import {
  getPublicToolRuntime,
} from "@/lib/tools/public-calculator";
import {
  getToolPage,
  getToolPageKeys,
} from "@/lib/tools/tool-pages";

type ToolPageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getToolPageKeys().map((key) => {
    const [category, slug] =
      key.split("/");

    return {
      category,
      slug,
    };
  });
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { category, slug } =
    await params;
  const tool =
    getToolPage(category, slug);

  if (!tool) {
    return {};
  }

  return {
    title: tool.name,
    description: tool.metaDescription,
    alternates: {
      canonical:
        `/tools/${tool.category}/${tool.slug}`,
    },
    openGraph: {
      title: tool.name,
      description: tool.metaDescription,
      type: "website",
    },
  };
}

export default async function ToolPage({
  params,
}: ToolPageProps) {
  const { category, slug } =
    await params;

  const runtime =
    await getPublicToolRuntime(
      category,
      slug,
    );

  if (!runtime) {
    notFound();
  }

  const tool = runtime.presentation;

  if (
    process.env.NODE_ENV ===
      "development" &&
    runtime.readiness
  ) {
    console.info(
      `[calculator:${category}/${slug}]`,
      {
        level:
          runtime.readiness.level,
        publishable:
          runtime.readiness.publishable,
        verified:
          runtime.readiness.verified,
        issues:
          runtime.readiness.issues.map(
            (issue) => issue.code,
          ),
      },
    );
  }

  return (
    <ToolPageShell
      tool={tool}
      database={runtime.database}
    >
      <CalculatorRenderer
        calculatorKey={
          tool.calculatorKey
        }
        toolSlug={tool.slug}
        toolName={tool.name}
      />
    </ToolPageShell>
  );
}
