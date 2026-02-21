import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodayTomorrowCard } from "../TodayTomorrowCard";
import type { ScheduleEntry } from "../../../types/schedule";

const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;

describe("TodayTomorrowCard", () => {
  it("今日と明日のゴミが表示される", () => {
    const todayEntries: ScheduleEntry[] = [
      {
        id: "1",
        trash: { name: "燃えるゴミ", icon: "burn" },
        rule: { type: "weekly", dayOfWeek: TUESDAY },
      },
    ];
    const tomorrowEntries: ScheduleEntry[] = [
      {
        id: "2",
        trash: { name: "資源ゴミ", icon: "recycle" },
        rule: { type: "weekly", dayOfWeek: WEDNESDAY },
      },
    ];
    render(
      <TodayTomorrowCard
        todayEntries={todayEntries}
        tomorrowEntries={tomorrowEntries}
        tomorrow={new Date(2026, 1, 18)}
      />,
    );
    expect(screen.getByText("今日")).toBeInTheDocument();
    expect(screen.getByText("明日")).toBeInTheDocument();
    expect(screen.getByText("燃えるゴミ")).toBeInTheDocument();
    expect(screen.getByText("資源ゴミ")).toBeInTheDocument();
  });

  it("両方空の場合は回収なしメッセージが表示される", () => {
    render(
      <TodayTomorrowCard todayEntries={[]} tomorrowEntries={[]} tomorrow={new Date(2026, 1, 18)} />,
    );
    const emptyMessages = screen.getAllByText("回収はありません");
    expect(emptyMessages).toHaveLength(2);
  });

  it("明日の日付ラベルが表示される", () => {
    render(
      <TodayTomorrowCard todayEntries={[]} tomorrowEntries={[]} tomorrow={new Date(2026, 1, 18)} />,
    );
    expect(screen.getByText("2月18日（水曜日）")).toBeInTheDocument();
  });

  it("明日のRuleBadgeが表示される", () => {
    const tomorrowEntries: ScheduleEntry[] = [
      {
        id: "1",
        trash: { name: "ビン", icon: "bottle" },
        rule: { type: "biweekly", dayOfWeek: WEDNESDAY, referenceDate: "2026-01-07" },
      },
    ];
    render(
      <TodayTomorrowCard
        todayEntries={[]}
        tomorrowEntries={tomorrowEntries}
        tomorrow={new Date(2026, 1, 18)}
      />,
    );
    expect(screen.getByText("隔週")).toBeInTheDocument();
  });

  it("第N曜日ルールのバッジが明日側に表示される", () => {
    const thursday = new Date(2026, 1, 19);
    const tomorrowEntries: ScheduleEntry[] = [
      {
        id: "1",
        trash: { name: "古紙", icon: "paper" },
        rule: { type: "nthWeekday", patterns: [{ dayOfWeek: THURSDAY, weekNumbers: [1, 3] }] },
      },
    ];
    render(
      <TodayTomorrowCard todayEntries={[]} tomorrowEntries={tomorrowEntries} tomorrow={thursday} />,
    );
    expect(screen.getByText("第1・第3")).toBeInTheDocument();
  });
});
