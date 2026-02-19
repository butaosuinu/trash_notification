import { describe, it, expect } from "vitest";
import { createStore } from "jotai";
import { scheduleAtom } from "../scheduleAtom";
import type { TrashSchedule } from "../../types/schedule";

describe("scheduleAtom", () => {
  it("初期値はバージョン2の空エントリー", () => {
    const store = createStore();
    const schedule = store.get(scheduleAtom);
    expect(schedule).toEqual({ version: 2, entries: [] });
  });

  it("スケジュールを更新できる", () => {
    const store = createStore();
    const newSchedule: TrashSchedule = {
      version: 2,
      entries: [
        {
          id: "1",
          trash: { name: "燃えるゴミ", icon: "burn" },
          rule: { type: "weekly", dayOfWeek: 2 },
        },
      ],
    };
    store.set(scheduleAtom, newSchedule);
    expect(store.get(scheduleAtom)).toEqual(newSchedule);
  });
});
