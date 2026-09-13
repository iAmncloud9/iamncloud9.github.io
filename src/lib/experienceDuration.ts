const CURRENT_END_LABELS = new Set(["now", "present", "current"]);

type MonthYear = { month: number; year: number };

function parseMonthYear(value: string): MonthYear | null {
  const match = value.trim().match(/^(0?[1-9]|1[0-2])\/(\d{4})$/);
  if (!match) return null;
  return { month: Number(match[1]), year: Number(match[2]) };
}

function pluralize(value: number, singular: string) {
  return `${value} ${singular}${value === 1 ? "" : "s"}`;
}

/**
 * Calculates an employment duration from MM/YYYY values.
 * Calendar months are inclusive because only month-level precision is stored:
 * 08/2026 through 11/2026 covers Aug, Sep, Oct, and Nov (4 months).
 */
export function calculateExperienceDuration(
  startDate: string,
  endDate: string,
  referenceDate: Date | null,
): string | null {
  const start = parseMonthYear(startDate);
  if (!start) return "Check start date";

  const normalizedEnd = endDate.trim().toLowerCase();
  const usesCurrentMonth = CURRENT_END_LABELS.has(normalizedEnd);
  if (usesCurrentMonth && !referenceDate) return null;

  const end = usesCurrentMonth
    ? { month: referenceDate!.getMonth() + 1, year: referenceDate!.getFullYear() }
    : parseMonthYear(endDate);
  if (!end) return "Check end date";

  const totalMonths = (end.year - start.year) * 12 + (end.month - start.month) + 1;
  if (totalMonths <= 0) return "Invalid date range";

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return [years ? pluralize(years, "year") : "", months ? pluralize(months, "month") : ""]
    .filter(Boolean)
    .join(" ");
}
