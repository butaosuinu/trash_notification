import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { WeeklySchedule } from "../WeeklySchedule";
import type { TrashSchedule } from "../../../types/schedule";

const TUESDAY = 2;
const WEDNESDAY = 3;

const mockSchedule: TrashSchedule = {
  version: 2,
  entries: [
    {
      id: "1",
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: TUESDAY },
    },
    {
      id: "2",
      trash: { name: "ビン・缶・ペットボトル", icon: "bottle" },
      rule: { type: "weekly", dayOfWeek: WEDNESDAY },
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
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // 2026-02-17 火曜日 (week: 2/15 Sun - 2/21 Sat)
    vi.setSystemTime(new Date(2026, 1, 17, 10, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("スケジュールが全曜日分表示される", () => {
    render(<WeeklySchedule schedule={mockSchedule} />);
    expect(screen.getByText("今週のゴミ収集")).toBeInTheDocument();
    expect(screen.getAllByText("燃えるゴミ")).toHaveLength(2);
    expect(screen.getByText("ビン・缶・ペットボトル")).toBeInTheDocument();
    expect(screen.getByText("資源ゴミ")).toBeInTheDocument();
  });

  it("各列に実際の日付が表示される", () => {
    render(<WeeklySchedule schedule={mockSchedule} />);
    expect(screen.getByText("2/15")).toBeInTheDocument();
    expect(screen.getByText("2/17")).toBeInTheDocument();
    expect(screen.getByText("2/21")).toBeInTheDocument();
  });

  it("収集がない日はハイフンが表示される", () => {
    render(<WeeklySchedule schedule={mockSchedule} />);
    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBe(3);
  });

  it("隔週ルールにバッジが表示される", () => {
    // 2026-02-16 (Mon): differenceInCalendarWeeks from 2026-01-05 = 6, 6%2=0 → matches
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
    // 2026-02-18 (Wed) is 3rd Wednesday: ceil(18/7) = 3
    const schedule: TrashSchedule = {
      version: 2,
      entries: [
        {
          id: "nth-1",
          trash: { name: "粗大ゴミ", icon: "oversized" },
          rule: { type: "nthWeekday", patterns: [{ dayOfWeek: WEDNESDAY, weekNumbers: [1, 3] }] },
        },
      ],
    };
    render(<WeeklySchedule schedule={schedule} />);
    expect(screen.getByText("第1・第3")).toBeInTheDocument();
  });

  it("複数パターンのnthWeekdayが曜日ごとに分離して表示される", () => {
    // 2026-02-17 is 3rd Tue (ceil(17/7)=3), 2026-02-18 is 3rd Wed (ceil(18/7)=3)
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
    render(<WeeklySchedule schedule={schedule} />);
    const tuesdayColumn = screen.getByTestId("day-column-2");
    expect(within(tuesdayColumn).getByText("資源ゴミ")).toBeInTheDocument();
    expect(within(tuesdayColumn).getByText("第3")).toBeInTheDocument();
    const wednesdayColumn = screen.getByTestId("day-column-3");
    expect(within(wednesdayColumn).getByText("資源ゴミ")).toBeInTheDocument();
    expect(within(wednesdayColumn).getByText("第3")).toBeInTheDocument();
  });

  it("指定日のスケジュールが今後の指定日セクションに表示される", () => {
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
  });

  it("過去の指定日は表示されない", () => {
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
  });
});
