import { describe, it, expect } from "vitest";
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
});
