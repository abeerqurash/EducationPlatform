import {
  and,
  desc,
  eq,
} from "drizzle-orm";

import { db } from "../client";
import {
  calculatorVersions,
  toolCategories,
  tools,
} from "../schema/tools";

export type AdminPublicationTool = {
  id: string;
  name: string;
  slug: string;
  categoryName: string | null;
  status: string;
  currentVersion: string | null;
  applicableYear: number | null;
  lastReviewedAt: Date | null;
  calculatorVerificationStatus: string | null;
};

export async function listAdminPublicationTools():
  Promise<AdminPublicationTool[]> {
  return db
    .select({
      id: tools.id,
      name: tools.name,
      slug: tools.slug,
      categoryName: toolCategories.name,
      status: tools.status,
      currentVersion: tools.currentVersion,
      applicableYear: tools.applicableYear,
      lastReviewedAt: tools.lastReviewedAt,
      calculatorVerificationStatus:
        calculatorVersions.verificationStatus,
    })
    .from(tools)
    .leftJoin(
      toolCategories,
      eq(
        tools.categoryId,
        toolCategories.id,
      ),
    )
    .leftJoin(
      calculatorVersions,
      and(
        eq(
          calculatorVersions.toolId,
          tools.id,
        ),
        eq(
          calculatorVersions.version,
          tools.currentVersion,
        ),
        eq(
          calculatorVersions.isActive,
          true,
        ),
      ),
    )
    .orderBy(
      desc(tools.updatedAt),
    );
}
