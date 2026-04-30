import { parseIsoDateOnlyLocal } from "@/lib/format-display-date";

export type ReservationTimeFilter = "today" | "week" | "month" | "all";

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function endOfLocalDay(d: Date): Date {
  const x = startOfLocalDay(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

/** Calendar week starting Sunday, through Saturday end-of-day (local). */
function startOfWeekSunday(d: Date): Date {
  const s = startOfLocalDay(d);
  s.setDate(s.getDate() - s.getDay());
  return s;
}

function endOfWeekSaturday(d: Date): Date {
  const s = startOfWeekSunday(d);
  const e = new Date(s);
  e.setDate(e.getDate() + 6);
  return endOfLocalDay(e);
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date): Date {
  return endOfLocalDay(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

/** Whether a reservation pickup date (`YYYY-MM-DD`) falls in the selected window (local calendar). */
export function reservationStartMatchesFilter(
  startDateIso: string,
  filter: ReservationTimeFilter,
  now: Date = new Date(),
): boolean {
  if (filter === "all") return true;
  const t = parseIsoDateOnlyLocal(startDateIso).getTime();
  if (filter === "today") {
    return t >= startOfLocalDay(now).getTime() && t <= endOfLocalDay(now).getTime();
  }
  if (filter === "week") {
    return t >= startOfWeekSunday(now).getTime() && t <= endOfWeekSaturday(now).getTime();
  }
  return t >= startOfMonth(now).getTime() && t <= endOfMonth(now).getTime();
}
