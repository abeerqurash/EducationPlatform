/** A bounded, centered pagination window. Never allocates an array proportional to the total result count. */
export function historyPageWindow(page: number, totalPages: number, windowSize = 5): number[] {
  const total = Number.isSafeInteger(totalPages) ? Math.max(1, totalPages) : 1;
  const current = Number.isSafeInteger(page) ? Math.max(1, Math.min(page, total)) : 1;
  const size = Number.isSafeInteger(windowSize) ? Math.max(1, Math.min(windowSize, 9)) : 5;
  const start = Math.max(1, Math.min(current - Math.floor(size / 2), total - size + 1));
  return Array.from({ length: Math.min(size, total) }, (_, index) => start + index);
}
