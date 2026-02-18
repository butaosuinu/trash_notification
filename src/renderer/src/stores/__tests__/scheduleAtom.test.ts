import { describe, it, expect } from "vitest";
import { createStore } from "jotai";
import { scheduleAtom } from "../scheduleAtom";
import type { TrashSchedule } from "../../types/schedule";

describe("scheduleAtom", () => {
  it("初期値は空のオブジェクト", () => {
    const store = createStore();
    const schedule = store.get(scheduleAtom);
    expect(schedule).toEqual({});
  });

  it("スケジュールを更新できる", () => {
    const store = createStore();
    const newSchedule: TrashSchedule = {
      "0": { name: "", icon: "" },
      "2": { name: "燃えるゴミ", icon: "burn" },
    };
    store.set(scheduleAtom, newSchedule);
    expect(store.get(scheduleAtom)).toEqual(newSchedule);
  });
});
