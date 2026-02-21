import { getDay, getDate, differenceInCalendarWeeks, parseISO, startOfDay } from "date-fns";
import { formatDateToISO } from "./dateUtils";
import type {
  ScheduleRule,
  ScheduleEntry,
  WeeklyRule,
  BiweeklyRule,
  NthWeekdayRule,
  SpecificDatesRule,
} from "../types/schedule";

const BIWEEKLY_DIVISOR = 2;
const DAYS_PER_WEEK = 7;

function matchesWeekly(date: Date, rule: WeeklyRule): boolean {
  return getDay(date) === rule.dayOfWeek;
}

function matchesBiweekly(date: Date, rule: BiweeklyRule): boolean {
  if (getDay(date) !== rule.dayOfWeek) return false;
  const ref = startOfDay(parseISO(rule.referenceDate));
  const target = startOfDay(date);
  const weeksDiff = differenceInCalendarWeeks(target, ref, { weekStartsOn: 0 });
  return weeksDiff % BIWEEKLY_DIVISOR === 0;
}

function matchesNthWeekday(date: Date, rule: NthWeekdayRule): boolean {
  const day = getDay(date);
  const dayOfMonth = getDate(date);
  const occurrence = Math.ceil(dayOfMonth / DAYS_PER_WEEK);
  return rule.patterns.some(
    (pattern) => pattern.dayOfWeek === day && pattern.weekNumbers.includes(occurrence),
  );
}

function matchesSpecificDates(date: Date, rule: SpecificDatesRule): boolean {
  const dateStr = formatDateToISO(date);
  return rule.dates.includes(dateStr);
}

export function doesRuleMatch(date: Date, rule: ScheduleRule): boolean {
  switch (rule.type) {
    case "weekly":
      return matchesWeekly(date, rule);
    case "biweekly":
      return matchesBiweekly(date, rule);
    case "nthWeekday":
      return matchesNthWeekday(date, rule);
    case "specificDates":
      return matchesSpecificDates(date, rule);
  }
}

export function getTodayEntries(date: Date, entries: ScheduleEntry[]): ScheduleEntry[] {
  return entries.filter((entry) => doesRuleMatch(date, entry.rule));
}
