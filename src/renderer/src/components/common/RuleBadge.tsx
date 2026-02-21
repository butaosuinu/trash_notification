import type { ScheduleRule } from "../../types/schedule";
import { RULE_TYPE_LABELS, SHORT_DAY_NAMES } from "../../constants/schedule";

const BADGE_STYLES: Record<string, string> = {
  biweekly: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  nthWeekday: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  specificDates: "bg-frost-cyan/15 text-frost-cyan border-frost-cyan/30",
};

function getBadgeLabel(rule: ScheduleRule, dayOfWeek?: number): string | null {
  if (rule.type === "weekly") return null;
  if (rule.type === "nthWeekday") {
    const { patterns } = rule;
    if (dayOfWeek !== undefined) {
      const weekNumbers = patterns
        .filter((p) => p.dayOfWeek === dayOfWeek)
        .flatMap((p) => p.weekNumbers)
        .toSorted((a, b) => a - b);
      if (weekNumbers.length === 0) return null;
      return weekNumbers.map((n: number) => `第${String(n)}`).join("・");
    }
    const isAllSameDay = patterns.every((p) => p.dayOfWeek === patterns[0].dayOfWeek);
    if (isAllSameDay) {
      const allWeekNumbers = [...new Set(patterns.flatMap((p) => p.weekNumbers))].toSorted(
        (a, b) => a - b,
      );
      return allWeekNumbers.map((n: number) => `第${String(n)}`).join("・");
    }
    return patterns
      .flatMap((p) => p.weekNumbers.map((n) => `第${String(n)}${SHORT_DAY_NAMES[p.dayOfWeek]}`))
      .join("・");
  }
  return RULE_TYPE_LABELS[rule.type] ?? null;
}

type RuleBadgeProps = {
  readonly rule: ScheduleRule;
  readonly dayOfWeek?: number;
};

export function RuleBadge({ rule, dayOfWeek }: RuleBadgeProps) {
  const label = getBadgeLabel(rule, dayOfWeek);
  if (label === null) return null;

  const style = BADGE_STYLES[rule.type] ?? "";

  return (
    <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${style}`}>
      {label}
    </span>
  );
}
