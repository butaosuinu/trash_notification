import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TomorrowTrash } from "../TomorrowTrash";
import type { ScheduleEntry } from "../../../types/schedule";

const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;

describe("TomorrowTrash", () => {
  it("ゴミの種類が表示される", () => {
    const entries: ScheduleEntry[] = [
      {
        id: "1",
        trash: { name: "燃えるゴミ", icon: "burn" },
        rule: { type: "weekly", dayOfWeek: TUESDAY },
      },
    ];
    render(<TomorrowTrash entries={entries} tomorrow={new Date()} />);
    expect(screen.getByText("明日の収集するゴミ")).toBeInTheDocument();
    expect(screen.getByText("燃えるゴミ")).toBeInTheDocument();
  });

  it("隔週ルールのバッジが表示される", () => {
    const entries: ScheduleEntry[] = [
      {
        id: "1",
        trash: { name: "ビン", icon: "bottle" },
        rule: { type: "biweekly", dayOfWeek: WEDNESDAY, referenceDate: "2026-01-07" },
      },
    ];
    render(<TomorrowTrash entries={entries} tomorrow={new Date()} />);
    expect(screen.getByText("隔週")).toBeInTheDocument();
  });

  it("第N曜日ルールのバッジが表示される", () => {
    // 2026-02-19 木曜日
    const thursday = new Date(2026, 1, 19);
    const entries: ScheduleEntry[] = [
      {
        id: "1",
        trash: { name: "古紙", icon: "paper" },
        rule: { type: "nthWeekday", patterns: [{ dayOfWeek: THURSDAY, weekNumbers: [1, 3] }] },
      },
    ];
    render(<TomorrowTrash entries={entries} tomorrow={thursday} />);
    expect(screen.getByText("第1・第3")).toBeInTheDocument();
  });

  it("エントリーが空の場合は収集なしメッセージが表示される", () => {
    render(<TomorrowTrash entries={[]} tomorrow={new Date()} />);
    expect(screen.getByText("明日のゴミ回収はありません")).toBeInTheDocument();
  });
});
