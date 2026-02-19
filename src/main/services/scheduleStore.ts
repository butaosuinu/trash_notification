import { randomUUID } from "node:crypto";
import Store from "electron-store";

type TrashDay = {
  name: string;
  icon: string;
};

type WeeklyRule = { type: "weekly"; dayOfWeek: number };
type BiweeklyRule = { type: "biweekly"; dayOfWeek: number; referenceDate: string };
type NthWeekdayRule = { type: "nthWeekday"; dayOfWeek: number; weekNumbers: number[] };
type SpecificDatesRule = { type: "specificDates"; dates: string[] };
type ScheduleRule = WeeklyRule | BiweeklyRule | NthWeekdayRule | SpecificDatesRule;

type ScheduleEntry = {
  id: string;
  trash: TrashDay;
  rule: ScheduleRule;
};

type TrashScheduleV1 = Record<string, TrashDay>;

export type TrashSchedule = {
  version: typeof SCHEDULE_VERSION;
  entries: ScheduleEntry[];
};

type StoreSchema = {
  schedule: TrashSchedule | TrashScheduleV1;
  apiKey: string | null;
};

const SCHEDULE_VERSION = 2;

function isV2Schedule(data: unknown): data is TrashSchedule {
  return (
    typeof data === "object" &&
    data !== null &&
    "version" in data &&
    (data as Record<string, unknown>).version === SCHEDULE_VERSION
  );
}

export function migrateV1ToV2(v1: TrashScheduleV1): TrashSchedule {
  const entries: ScheduleEntry[] = [];
  for (const [key, trash] of Object.entries(v1)) {
    if (trash.name !== "") {
      entries.push({
        id: randomUUID(),
        trash,
        rule: { type: "weekly", dayOfWeek: Number(key) },
      });
    }
  }
  return { version: SCHEDULE_VERSION, entries };
}

const DEFAULT_SCHEDULE: TrashSchedule = {
  version: 2,
  entries: [
    {
      id: randomUUID(),
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: 2 },
    },
    {
      id: randomUUID(),
      trash: { name: "ビン・缶・ペットボトル", icon: "bottle" },
      rule: { type: "weekly", dayOfWeek: 3 },
    },
    {
      id: randomUUID(),
      trash: { name: "資源ゴミ", icon: "recycle" },
      rule: { type: "weekly", dayOfWeek: 4 },
    },
    {
      id: randomUUID(),
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: 5 },
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
    return data;
  }

  const migrated = migrateV1ToV2(data);
  store.set("schedule", migrated);
  return migrated;
}

export function saveSchedule(schedule: TrashSchedule): void {
  store.set("schedule", schedule);
}

export function getApiKey(): string | null {
  return store.get("apiKey");
}

export function setApiKey(key: string): void {
  store.set("apiKey", key);
}
