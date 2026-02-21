import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeeklySchedule } from "../WeeklySchedule";
import type { TrashSchedule } from "../../../types/schedule";

const mockSchedule: TrashSchedule = {
  version: 2,
  entries: [
    {
      id: "1",
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: 2 },
    },
    {
      id: "2",
      trash: { name: "ビン・缶・ペットボトル", icon: "bottle" },
      rule: { type: "weekly", dayOfWeek: 3 },
    },
    {
      id: "3",
      trash: { name: "資源ゴミ", icon: "recycle" },
      rule: { type: "weekly", dayOfWeek: 4 },
    },
    {
      id: "4",
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: 5 },
    },
  ],
};

describe("WeeklySchedule", () => {
  it("スケジュールが全曜日分表示される", () => {
    render(<WeeklySchedule schedule={mockSchedule} />);
    expect(screen.getByText("週間スケジュール")).toBeInTheDocument();
    expect(screen.getAllByText("燃えるゴミ")).toHaveLength(2);
    expect(screen.getByText("ビン・缶・ペットボトル")).toBeInTheDocument();
    expect(screen.getByText("資源ゴミ")).toBeInTheDocument();
  });

  it("収集がない日はハイフンが表示される", () => {
    render(<WeeklySchedule schedule={mockSchedule} />);
    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBe(3);
  });

  it("隔週ルールにバッジが表示される", () => {
    const schedule: TrashSchedule = {
      version: 2,
      entries: [
        {
          id: "bw-1",
          trash: { name: "燃えないゴミ", icon: "nonburn" },
          rule: { type: "biweekly", dayOfWeek: 1, referenceDate: "2026-01-05" },
        },
      ],
    };
    render(<WeeklySchedule schedule={schedule} />);
    expect(screen.getByText("隔週")).toBeInTheDocument();
  });

  it("第N曜日ルールにバッジが表示される", () => {
    const schedule: TrashSchedule = {
      version: 2,
      entries: [
        {
          id: "nth-1",
          trash: { name: "粗大ゴミ", icon: "oversized" },
          rule: { type: "nthWeekday", patterns: [{ dayOfWeek: 3, weekNumbers: [1, 3] }] },
        },
      ],
    };
    render(<WeeklySchedule schedule={schedule} />);
    expect(screen.getByText("第1・第3")).toBeInTheDocument();
  });

  it("複数パターンのnthWeekdayが複数曜日に表示される", () => {
    const schedule: TrashSchedule = {
      version: 2,
      entries: [
        {
          id: "nth-mix",
          trash: { name: "資源ゴミ", icon: "recycle" },
          rule: {
            type: "nthWeekday",
            patterns: [
              { dayOfWeek: 3, weekNumbers: [2] },
              { dayOfWeek: 2, weekNumbers: [4] },
            ],
          },
        },
      ],
    };
    render(<WeeklySchedule schedule={schedule} />);
    expect(screen.getAllByText("資源ゴミ")).toHaveLength(2);
    expect(screen.getAllByText("第2水・第4火")).toHaveLength(2);
  });

  it("指定日のスケジュールが今後の指定日セクションに表示される", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 17));

    const schedule: TrashSchedule = {
      version: 2,
      entries: [
        {
          id: "sd-1",
          trash: { name: "粗大ゴミ", icon: "oversized" },
          rule: { type: "specificDates", dates: ["2026-03-15", "2026-04-20"] },
        },
      ],
    };
    render(<WeeklySchedule schedule={schedule} />);

    expect(screen.getByText("今後の指定日")).toBeInTheDocument();
    expect(screen.getByText("2026-03-15")).toBeInTheDocument();
    expect(screen.getByText("2026-04-20")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("過去の指定日は表示されない", () => {
    vi.useFakeTimers();
    // 2026-04-01
    vi.setSystemTime(new Date(2026, 3, 1));

    const schedule: TrashSchedule = {
      version: 2,
      entries: [
        {
          id: "sd-2",
          trash: { name: "粗大ゴミ", icon: "oversized" },
          rule: { type: "specificDates", dates: ["2026-03-15", "2026-04-20"] },
        },
      ],
    };
    render(<WeeklySchedule schedule={schedule} />);

    expect(screen.queryByText("2026-03-15")).not.toBeInTheDocument();
    expect(screen.getByText("2026-04-20")).toBeInTheDocument();

    vi.useRealTimers();
  });
});
