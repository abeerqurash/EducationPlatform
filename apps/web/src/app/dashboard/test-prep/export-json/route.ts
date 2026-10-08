import { auth } from "@/auth";
import { getStudentTestPrepExport, normalizeTestPrepHistoryQuery } from "@education/database";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Owner-scoped, bounded JSON export; applies exactly the same filters as CSV. */
export async function GET(request: Request) {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) {
    return NextResponse.json({ error: "Authentication required" }, {
      status: 401,
      headers: { "Cache-Control": "private, no-store" },
    });
  }

  const params = new URL(request.url).searchParams;
  const query = normalizeTestPrepHistoryQuery({
    exam: params.get("exam") ?? undefined,
    q: params.get("q") ?? undefined,
    sort: params.get("sort") ?? undefined,
    from: params.get("from") ?? undefined,
    to: params.get("to") ?? undefined,
  });
  const rows = await getStudentTestPrepExport(userId, query);
  const data = {
    schemaVersion: 1,
    exportType: "saved-test-prep-results",
    filters: { exam: query.exam, search: query.q, sort: query.sort, from: query.from ?? null, to: query.to ?? null },
    exportedCount: rows.length,
    limit: 1000,
    results: rows.map((row) => ({
      savedAtUtc: row.createdAt.toISOString(),
      exam: /(^|-)sat(-|$)/.test(row.toolSlug) ? "SAT" : "ACT",
      toolName: row.toolName,
      summary: row.summary,
      calculatorVersion: row.calculatorVersion ?? null,
    })),
  };
  return new Response(JSON.stringify(data, null, 2) + "\n", {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="educationplatform-exam-results.json"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
