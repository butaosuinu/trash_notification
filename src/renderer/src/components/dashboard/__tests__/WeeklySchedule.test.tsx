import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeeklySchedule } from "../WeeklySchedule";
import type { TrashSchedule } from "../../../types/schedule";

const mockSchedule: TrashSchedule = {
  "0": { name: "", icon: "" },
  "1": { name: "", icon: "" },
  "2": { name: "燃えるゴミ", icon: "burn" },
  "3": { name: "ビン・缶・ペットボトル", icon: "bottle" },
  "4": { name: "資源ゴミ", icon: "recycle" },
  "5": { name: "燃えるゴミ", icon: "burn" },
  "6": { name: "", icon: "" },
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
