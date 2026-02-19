export type TrashDay = {
  name: string;
  icon: string;
};

// --- V1 (legacy weekly format) ---

export type TrashScheduleV1 = Partial<Record<string, TrashDay>>;

// --- Schedule Rules ---

export type WeeklyRule = {
  type: "weekly";
  dayOfWeek: number;
};

export type BiweeklyRule = {
  type: "biweekly";
  dayOfWeek: number;
  referenceDate: string;
};

export type NthWeekdayRule = {
  type: "nthWeekday";
  dayOfWeek: number;
  weekNumbers: number[];
};

export type SpecificDatesRule = {
  type: "specificDates";
  dates: string[];
};

export type ScheduleRule = WeeklyRule | BiweeklyRule | NthWeekdayRule | SpecificDatesRule;

// --- Schedule Entry ---

export type ScheduleEntry = {
  id: string;
  trash: TrashDay;
  rule: ScheduleRule;
};

// --- V2 (current format) ---

export const SCHEDULE_VERSION = 2;

export type TrashScheduleV2 = {
  version: typeof SCHEDULE_VERSION;
  entries: ScheduleEntry[];
};

export type TrashSchedule = TrashScheduleV2;
