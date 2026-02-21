import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeeklyTrashList } from "../WeeklyTrashList";
import type { TrashSchedule } from "../../../types/schedule";

const TUESDAY = 2;
const WEDNESDAY = 3;

describe("WeeklyTrashList", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // 2026-02-17 火曜日
    vi.setSystemTime(new Date(2026, 1, 17, 10, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("今週のゴミ収集タイトルが表示される", () => {
    const schedule: TrashSchedule = { version: 2, entries: [] };
    render(<WeeklyTrashList schedule={schedule} />);
    expect(screen.getByText("今週のゴミ収集")).toBeInTheDocument();
  });

  it("7日分の日付が表示される", () => {
    const schedule: TrashSchedule = { version: 2, entries: [] };
    render(<WeeklyTrashList schedule={schedule} />);
    // 2026-02-15(日) から 2026-02-21(土) の週
    expect(screen.getByText("2/15（日）")).toBeInTheDocument();
    expect(screen.getByText("2/17（火）")).toBeInTheDocument();
    expect(screen.getByText("2/21（土）")).toBeInTheDocument();
  });

  it("今日のラベルにTODAYが表示される", () => {
    const schedule: TrashSchedule = { version: 2, entries: [] };
    render(<WeeklyTrashList schedule={schedule} />);
    expect(screen.getByText("TODAY")).toBeInTheDocument();
  });

  it("該当日にゴミの種類が表示される", () => {
    const schedule: TrashSchedule = {
      version: 2,
      entries: [
        {
          id: "1",
          trash: { name: "燃えるゴミ", icon: "burn" },
          rule: { type: "weekly", dayOfWeek: TUESDAY },
        },
        {
          id: "2",
          trash: { name: "資源ゴミ", icon: "recycle" },
          rule: { type: "weekly", dayOfWeek: WEDNESDAY },
        },
      ],
    };
    render(<WeeklyTrashList schedule={schedule} />);
    expect(screen.getByText("燃えるゴミ")).toBeInTheDocument();
    expect(screen.getByText("資源ゴミ")).toBeInTheDocument();
  });

  it("収集がない日には収集なしが表示される", () => {
    const schedule: TrashSchedule = { version: 2, entries: [] };
    render(<WeeklyTrashList schedule={schedule} />);
    const emptyLabels = screen.getAllByText("収集なし");
    expect(emptyLabels.length).toBe(7);
  });

  it("複数曜日のnthWeekdayバッジに曜日名が含まれる", () => {
    // 2026-02-17は第3火曜、2026-02-18は第3水曜
    const schedule: TrashSchedule = {
      version: 2,
      entries: [
        {
          id: "nth-mix",
          trash: { name: "資源ゴミ", icon: "recycle" },
          rule: {
            type: "nthWeekday",
            patterns: [
              { dayOfWeek: WEDNESDAY, weekNumbers: [3] },
              { dayOfWeek: TUESDAY, weekNumbers: [3] },
            ],
          },
        },
      ],
    };
    render(<WeeklyTrashList schedule={schedule} />);
    expect(screen.getAllByText("第3水・第3火")).toHaveLength(2);
  });

  it("同一曜日のnthWeekdayバッジに曜日名が含まれない", () => {
    // 2026-02-17は第3火曜
    const schedule: TrashSchedule = {
      version: 2,
      entries: [
        {
          id: "nth-same",
          trash: { name: "古紙", icon: "paper" },
          rule: {
            type: "nthWeekday",
            patterns: [{ dayOfWeek: TUESDAY, weekNumbers: [1, 3] }],
          },
        },
      ],
    };
    render(<WeeklyTrashList schedule={schedule} />);
    expect(screen.getByText("第1・第3")).toBeInTheDocument();
  });

  it("隔週ルールのバッジが表示される", () => {
    const schedule: TrashSchedule = {
      version: 2,
      entries: [
        {
          id: "1",
          trash: { name: "ビン", icon: "bottle" },
          rule: { type: "biweekly", dayOfWeek: TUESDAY, referenceDate: "2026-02-17" },
        },
      ],
    };
    render(<WeeklyTrashList schedule={schedule} />);
    expect(screen.getByText("隔週")).toBeInTheDocument();
    expect(screen.getByText("ビン")).toBeInTheDocument();
  });
});
