import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateListEditor } from "../DateListEditor";

function getDateInput(container: HTMLElement): Element {
  const input = container.querySelector('input[type="date"]');
  if (input === null) throw new Error("date input not found");
  return input;
}

describe("DateListEditor", () => {
  it("既存の日付が表示される", () => {
    render(<DateListEditor dates={["2026-03-15", "2026-04-20"]} onChange={vi.fn()} />);

    expect(screen.getByText("2026-03-15")).toBeInTheDocument();
    expect(screen.getByText("2026-04-20")).toBeInTheDocument();
  });

  it("日付がない場合はリストが表示されない", () => {
    render(<DateListEditor dates={[]} onChange={vi.fn()} />);

    expect(screen.queryByText("x")).not.toBeInTheDocument();
  });

  it("日付を追加できる", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    const { container } = render(<DateListEditor dates={[]} onChange={onChange} />);

    const dateInput = getDateInput(container);
    await user.clear(dateInput);
    await user.type(dateInput, "2026-05-10");
    await user.click(screen.getByText("追加"));

    expect(onChange).toHaveBeenCalledWith(["2026-05-10"]);
  });

  it("xボタンで日付を削除できる", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<DateListEditor dates={["2026-03-15", "2026-04-20"]} onChange={onChange} />);

    const deleteButtons = screen.getAllByText("x");
    await user.click(deleteButtons[0]);

    expect(onChange).toHaveBeenCalledWith(["2026-04-20"]);
  });

  it("重複する日付は追加されない", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    const { container } = render(<DateListEditor dates={["2026-03-15"]} onChange={onChange} />);

    const dateInput = getDateInput(container);
    await user.clear(dateInput);
    await user.type(dateInput, "2026-03-15");
    await user.click(screen.getByText("追加"));

    expect(onChange).not.toHaveBeenCalled();
  });
});
