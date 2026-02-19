import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RuleEditor } from "../RuleEditor";
import type { ScheduleRule } from "../../../types/schedule";

describe("RuleEditor", () => {
  it("weeklyルールで曜日セレクトが表示される", () => {
    const rule: ScheduleRule = { type: "weekly", dayOfWeek: 2 };
    render(<RuleEditor rule={rule} onChange={vi.fn()} />);

    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });

  it("ルール種別を切り替えるとonChangeが呼ばれる", async () => {
    const onChange = vi.fn();
    const rule: ScheduleRule = { type: "weekly", dayOfWeek: 2 };
    const user = userEvent.setup();

    render(<RuleEditor rule={rule} onChange={onChange} />);

    const [typeSelect] = screen.getAllByRole("combobox");
    await user.selectOptions(typeSelect, "biweekly");

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ type: "biweekly", dayOfWeek: 2 }),
    );
  });

  it("biweeklyルールで日付入力が表示される", () => {
    const rule: ScheduleRule = { type: "biweekly", dayOfWeek: 1, referenceDate: "2026-01-05" };
    render(<RuleEditor rule={rule} onChange={vi.fn()} />);

    const dateInput = screen.getByDisplayValue("2026-01-05");
    expect(dateInput).toBeInTheDocument();
  });

  it("nthWeekdayルールで週番号チェックボックスが表示される", () => {
    const rule: ScheduleRule = { type: "nthWeekday", dayOfWeek: 3, weekNumbers: [1, 3] };
    render(<RuleEditor rule={rule} onChange={vi.fn()} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(5);
    // 第1: checked, 第2: unchecked, 第3: checked
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });

  it("nthWeekdayの週番号チェックボックスをトグルできる", async () => {
    const onChange = vi.fn();
    const rule: ScheduleRule = { type: "nthWeekday", dayOfWeek: 3, weekNumbers: [1, 3] };
    const user = userEvent.setup();

    render(<RuleEditor rule={rule} onChange={onChange} />);

    const checkboxes = screen.getAllByRole("checkbox");
    // 第2を追加
    await user.click(checkboxes[1]);

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ weekNumbers: [1, 2, 3] }));
  });

  it("specificDatesルールでDateListEditorが表示される", () => {
    const rule: ScheduleRule = { type: "specificDates", dates: ["2026-03-15"] };
    render(<RuleEditor rule={rule} onChange={vi.fn()} />);

    expect(screen.getByText("2026-03-15")).toBeInTheDocument();
    expect(screen.getByText("追加")).toBeInTheDocument();
  });

  it("同じルール種別を選択しても変更されない", async () => {
    const onChange = vi.fn();
    const rule: ScheduleRule = { type: "weekly", dayOfWeek: 2 };
    const user = userEvent.setup();

    render(<RuleEditor rule={rule} onChange={onChange} />);

    const [typeSelect] = screen.getAllByRole("combobox");
    await user.selectOptions(typeSelect, "weekly");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("曜日を変更できる", async () => {
    const onChange = vi.fn();
    const rule: ScheduleRule = { type: "weekly", dayOfWeek: 0 };
    const user = userEvent.setup();

    render(<RuleEditor rule={rule} onChange={onChange} />);

    const selects = screen.getAllByRole("combobox");
    const daySelect = selects.at(-1);
    if (daySelect === undefined) throw new Error("day select not found");
    await user.selectOptions(daySelect, "3");

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ type: "weekly", dayOfWeek: 3 }),
    );
  });
});
