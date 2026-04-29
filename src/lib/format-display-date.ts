const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Parse `YYYY-MM-DD` as a local calendar date (avoids UTC midnight shifts). */
export function parseIsoDateOnlyLocal(isoDate: string): Date {
  const trimmed = isoDate.trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!m) return new Date(isoDate);
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  return new Date(y, mo - 1, d);
}

/** Formats `YYYY-MM-DD` (date-only from `<input type="date">`) as `Mar 17 2026`. */
export function formatDisplayDate(isoDate: string | null | undefined): string {
  if (isoDate == null || isoDate === "") return "";
  const trimmed = isoDate.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const [ys, ms, ds] = trimmed.split("-");
  const y = Number(ys);
  const m = Number(ms);
  const d = Number(ds);
  const label = MONTH_SHORT[m - 1];
  if (!label || Number.isNaN(d) || Number.isNaN(y)) return trimmed;
  return `${label} ${d} ${y}`;
}
