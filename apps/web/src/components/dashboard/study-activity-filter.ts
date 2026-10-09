/** Deterministic client-side filtering of the already account-scoped activity window. */
export type StudyActivityRow = {
  id: string;
  title: string;
  activityType: string;
  durationMinutes: number;
  createdAt: string;
  manual: boolean;
};
export type ActivityFilters = { query: string; type: string; sort: string };
export function filterStudyActivities<T extends StudyActivityRow>(rows: readonly T[], filters: ActivityFilters): T[] {
  const query = filters.query.trim().toLocaleLowerCase();
  return rows.filter(row =>
    (!query || row.title.toLocaleLowerCase().includes(query)) &&
    (filters.type === "all" || (filters.type === "sessions" ? row.activityType === "study_session" : row.activityType !== "study_session"))
  ).sort((a, b) => {
    if (filters.sort === "oldest") return a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id);
    if (filters.sort === "longest") return b.durationMinutes - a.durationMinutes || b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id);
    if (filters.sort === "title") return a.title.localeCompare(b.title) || a.id.localeCompare(b.id);
    return b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id);
  });
}
export function paginateStudyActivities<T>(rows: readonly T[], requestedPage: number, requestedSize: number) {
  const pageSize = [5, 10, 20].includes(requestedSize) ? requestedSize : 10;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const page = Number.isFinite(requestedPage) ? Math.min(totalPages, Math.max(1, Math.trunc(requestedPage))) : 1;
  const startIndex = (page - 1) * pageSize;
  return { page, pageSize, totalPages, total: rows.length, start: rows.length ? startIndex + 1 : 0, end: Math.min(rows.length, startIndex + pageSize), items: rows.slice(startIndex, startIndex + pageSize) };
}
