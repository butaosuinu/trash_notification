import { randomUUID } from "node:crypto";
import Store from "electron-store";
import { createLogger } from "./logger";
import type { TrashScheduleV1, TrashSchedule, ScheduleEntry } from "../../shared/types/schedule";
import { SCHEDULE_VERSION } from "../../shared/types/schedule";

export type { TrashSchedule } from "../../shared/types/schedule";
export { SCHEDULE_VERSION } from "../../shared/types/schedule";

const log = createLogger("scheduleStore");

type StoreSchema = {
  schedule: TrashSchedule | TrashScheduleV1;
  apiKey: string | null;
};

const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;

function isV2Schedule(data: unknown): data is TrashSchedule {
  return (
    typeof data === "object" &&
    data !== null &&
    "version" in data &&
    (data as Record<string, unknown>).version === SCHEDULE_VERSION
  );
}

export function migrateV1ToV2(v1: TrashScheduleV1): TrashSchedule {
  const entries: ScheduleEntry[] = Object.entries(v1).flatMap(([key, trash]) =>
    trash !== undefined && trash.name !== ""
      ? [{ id: randomUUID(), trash, rule: { type: "weekly" as const, dayOfWeek: Number(key) } }]
      : [],
  );
  return { version: SCHEDULE_VERSION, entries };
}

type LegacyNthWeekdayRule = {
  type: "nthWeekday";
  dayOfWeek: number;
  weekNumbers: number[];
};

function isLegacyNthWeekday(rule: unknown): rule is LegacyNthWeekdayRule {
  if (typeof rule !== "object" || rule === null) return false;
  return (
    "type" in rule && rule.type === "nthWeekday" && "dayOfWeek" in rule && !("patterns" in rule)
  );
}

function migrateNthWeekdayEntry(entry: ScheduleEntry): ScheduleEntry {
  if (!isLegacyNthWeekday(entry.rule)) return entry;
  return {
    ...entry,
    rule: {
      type: "nthWeekday",
      patterns: [{ dayOfWeek: entry.rule.dayOfWeek, weekNumbers: entry.rule.weekNumbers }],
    },
  };
}

export function migrateNthWeekdayRules(schedule: TrashSchedule): TrashSchedule {
  const needsMigration = schedule.entries.some((e) => isLegacyNthWeekday(e.rule));
  if (!needsMigration) return schedule;
  return { ...schedule, entries: schedule.entries.map(migrateNthWeekdayEntry) };
}

const DEFAULT_SCHEDULE: TrashSchedule = {
  version: SCHEDULE_VERSION,
  entries: [
    {
      id: randomUUID(),
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: TUESDAY },
    },
    {
      id: randomUUID(),
      trash: { name: "ビン・缶・ペットボトル", icon: "bottle" },
      rule: { type: "weekly", dayOfWeek: WEDNESDAY },
    },
    {
      id: randomUUID(),
      trash: { name: "資源ゴミ", icon: "recycle" },
      rule: { type: "weekly", dayOfWeek: THURSDAY },
    },
    {
      id: randomUUID(),
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: FRIDAY },
    },
  ],
};

const store = new Store<StoreSchema>({
  defaults: {
    schedule: DEFAULT_SCHEDULE,
    apiKey: null,
  },
});

export function loadSchedule(): TrashSchedule {
  const data = store.get("schedule");
  if (isV2Schedule(data)) {
    const migrated = migrateNthWeekdayRules(data);
    if (migrated !== data) {
      log.info("Migrating nthWeekday rules to patterns format");
      store.set("schedule", migrated);
    }
    return migrated;
  }

  log.info("Migrating schedule from V1 to V2");
  const migrated = migrateV1ToV2(data);
  store.set("schedule", migrated);
  return migrated;
}

export function saveSchedule(schedule: TrashSchedule): void {
  log.debug("Saving schedule, entries:", schedule.entries.length);
  store.set("schedule", schedule);
}

export function getApiKey(): string | null {
  return store.get("apiKey");
}

export function setApiKey(key: string): void {
  log.debug("API key updated");
  store.set("apiKey", key);
}
