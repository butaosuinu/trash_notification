import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TomorrowTrash } from "../TomorrowTrash";
import type { ScheduleEntry } from "../../../types/schedule";

describe("TomorrowTrash", () => {
  it("ゴミの種類が表示される", () => {
    const entries: ScheduleEntry[] = [
      {
        id: "1",
        trash: { name: "燃えるゴミ", icon: "burn" },
        rule: { type: "weekly", dayOfWeek: 2 },
      },
    ];
    render(<TomorrowTrash entries={entries} />);
    expect(screen.getByText("明日の収集するゴミ")).toBeInTheDocument();
    expect(screen.getByText("燃えるゴミ")).toBeInTheDocument();
  });

  it("隔週ルールのバッジが表示される", () => {
    const entries: ScheduleEntry[] = [
      {
        id: "1",
        trash: { name: "ビン", icon: "bottle" },
        rule: { type: "biweekly", dayOfWeek: 3, referenceDate: "2026-01-07" },
      },
    ];
    render(<TomorrowTrash entries={entries} />);
    expect(screen.getByText("隔週")).toBeInTheDocument();
  });

  it("第N曜日ルールのバッジが表示される", () => {
    const entries: ScheduleEntry[] = [
      {
        id: "1",
        trash: { name: "古紙", icon: "paper" },
        rule: { type: "nthWeekday", dayOfWeek: 4, weekNumbers: [1, 3] },
      },
    ];
    render(<TomorrowTrash entries={entries} />);
    expect(screen.getByText("第1・第3")).toBeInTheDocument();
  });

  it("エントリーが空の場合は収集なしメッセージが表示される", () => {
    render(<TomorrowTrash entries={[]} />);
    expect(screen.getByText("明日のゴミ回収はありません")).toBeInTheDocument();
  });
});
