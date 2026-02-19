import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrashInfo } from "../TrashInfo";
import type { ScheduleEntry } from "../../../types/schedule";

describe("TrashInfo", () => {
  it("ゴミの種類が表示される", () => {
    const entries: ScheduleEntry[] = [
      {
        id: "1",
        trash: { name: "燃えるゴミ", icon: "burn" },
        rule: { type: "weekly", dayOfWeek: 2 },
      },
    ];
    render(<TrashInfo entries={entries} />);
    expect(screen.getByText("燃えるゴミ")).toBeInTheDocument();
  });

  it("複数のエントリーが表示される", () => {
    const entries: ScheduleEntry[] = [
      {
        id: "1",
        trash: { name: "燃えるゴミ", icon: "burn" },
        rule: { type: "weekly", dayOfWeek: 2 },
      },
      {
        id: "2",
        trash: { name: "資源ゴミ", icon: "recycle" },
        rule: { type: "weekly", dayOfWeek: 2 },
      },
    ];
    render(<TrashInfo entries={entries} />);
    expect(screen.getByText("燃えるゴミ")).toBeInTheDocument();
    expect(screen.getByText("資源ゴミ")).toBeInTheDocument();
  });

  it("エントリーが空の場合は収集なしメッセージが表示される", () => {
    render(<TrashInfo entries={[]} />);
    expect(screen.getByText("今日のゴミ回収はありません")).toBeInTheDocument();
  });
});
