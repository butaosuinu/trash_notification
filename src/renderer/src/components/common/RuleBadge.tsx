import type { ScheduleRule } from "../../types/schedule";
import { RULE_TYPE_LABELS } from "../../constants/schedule";

const BADGE_STYLES: Record<string, string> = {
  biweekly: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  nthWeekday: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  specificDates: "bg-frost-cyan/15 text-frost-cyan border-frost-cyan/30",
};

function getBadgeLabel(rule: ScheduleRule): string | null {
  if (rule.type === "weekly") return null;
  if (rule.type === "nthWeekday") {
    const allWeekNumbers = [...new Set(rule.patterns.flatMap((p) => p.weekNumbers))].toSorted(
      (a, b) => a - b,
    );
    return allWeekNumbers.map((n: number) => `第${String(n)}`).join("・");
  }
  return RULE_TYPE_LABELS[rule.type] ?? null;
}

type RuleBadgeProps = {
  readonly rule: ScheduleRule;
};

export function RuleBadge({ rule }: RuleBadgeProps) {
  const label = getBadgeLabel(rule);
  if (label === null) return null;

  const style = BADGE_STYLES[rule.type] ?? "";

  return (
    <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${style}`}>
      {label}
    </span>
  );
}
