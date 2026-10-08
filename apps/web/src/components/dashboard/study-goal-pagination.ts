/** Deterministic, non-mutating pagination after filtering and sorting. */
export function paginateGoals<T>(goals: readonly T[], requestedPage: number, requestedSize: number) {
  const pageSize = [10, 20, 50].includes(requestedSize) ? requestedSize : 10;
  const totalPages = Math.max(1, Math.ceil(goals.length / pageSize));
  const page = Number.isSafeInteger(requestedPage) ? Math.min(totalPages, Math.max(1, requestedPage)) : 1;
  const offset = (page - 1) * pageSize;
  return {
    page, pageSize, totalPages,
    start: goals.length ? offset + 1 : 0,
    end: Math.min(offset + pageSize, goals.length),
    items: goals.slice(offset, offset + pageSize),
  };
}
