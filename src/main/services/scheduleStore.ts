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
  migratedVersion: string | null;
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
  const isMigrationNeeded = schedule.entries.some((e) => isLegacyNthWeekday(e.rule));
  if (!isMigrationNeeded) return schedule;
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
    migratedVersion: null,
  },
});

export function migrateStoreIfNeeded(appVersion: string): void {
  if (store.get("migratedVersion") === appVersion) return;

  const data = store.get("schedule");
  const v2 = isV2Schedule(data) ? data : migrateV1ToV2(data);
  const migrated = migrateNthWeekdayRules(v2);

  if (!isV2Schedule(data)) {
    log.info("Migrating schedule from V1 to V2");
  }
  if (migrated !== v2) {
    log.info("Migrating nthWeekday rules to patterns format");
  }
  if (v2 !== data || migrated !== v2) {
    store.set("schedule", migrated);
  }

  store.set("migratedVersion", appVersion);
  log.info(`Store migrated for version ${appVersion}`);
}

export function loadSchedule(): TrashSchedule {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- migrateStoreIfNeeded guarantees V2
  return store.get("schedule") as TrashSchedule;
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
