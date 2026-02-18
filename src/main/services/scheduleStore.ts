import Store from "electron-store";

type TrashDay = {
  name: string;
  icon: string;
};

export type TrashSchedule = Record<string, TrashDay>;

type StoreSchema = {
  schedule: TrashSchedule;
  apiKey: string | null;
};

const DEFAULT_SCHEDULE: TrashSchedule = {
  "0": { name: "", icon: "" },
  "1": { name: "", icon: "" },
  "2": { name: "燃えるゴミ", icon: "burn" },
  "3": { name: "ビン・缶・ペットボトル", icon: "bottle" },
  "4": { name: "資源ゴミ", icon: "recycle" },
  "5": { name: "燃えるゴミ", icon: "burn" },
  "6": { name: "", icon: "" },
};

const store = new Store<StoreSchema>({
  defaults: {
    schedule: DEFAULT_SCHEDULE,
    apiKey: null,
  },
});

export function loadSchedule(): TrashSchedule {
  return store.get("schedule");
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
