import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../App";

describe("App", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // 火曜日
    vi.setSystemTime(new Date(2026, 1, 17, 10, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("デフォルトでDashboardが表示される", () => {
    render(<App />);
    expect(screen.getByText("ゴミ通知")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "設定" })).toBeInTheDocument();
  });

  it("設定ボタンクリックでSettings画面に遷移する", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.click(screen.getByRole("button", { name: "設定" }));

    expect(screen.getByText("Gemini API キー")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "戻る" })).toBeInTheDocument();
  });

  it("戻るボタンクリックでDashboardに戻る", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.click(screen.getByRole("button", { name: "設定" }));
    expect(screen.getByRole("button", { name: "戻る" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "戻る" }));
    expect(screen.getByText("ゴミ通知")).toBeInTheDocument();
  });
});
