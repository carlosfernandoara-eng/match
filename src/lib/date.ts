import { format, parseISO, differenceInCalendarDays } from "date-fns";

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDatePt(dateISO: string): string {
  return format(parseISO(dateISO), "dd/MM/yyyy");
}

export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h <= 0) return `${m}min`;
  return `${h}h ${m}min`;
}

export function formatDurationLong(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function daysAgo(dateISO: string): number {
  return differenceInCalendarDays(new Date(), parseISO(dateISO));
}
