/** Only explicit supported ranges may influence database export queries. */
export type ProgressExportDays = 7 | 30 | 90;
export function parseProgressExportDays(value: string | null): ProgressExportDays {
  return value === "7" ? 7 : value === "90" ? 90 : 30;
}
