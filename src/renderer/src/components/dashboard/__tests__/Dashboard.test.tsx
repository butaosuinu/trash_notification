import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "jotai";
import { Dashboard } from "../Dashboard";
import type { TrashSchedule } from "../../../types/schedule";

const TUESDAY = 2;

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
      trash: { name: "資源ゴミ", icon: "recycle" },
      rule: { type: "weekly", dayOfWeek: 3 },
    },
  ],
};

describe("Dashboard", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // 火曜日
    vi.setSystemTime(new Date(2026, 1, 17, 10, 0, 0));
    vi.mocked(window.electronAPI.getSchedule).mockResolvedValue(mockSchedule);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("スケジュールを読み込んで今日のゴミを表示する", async () => {
    render(
      <Provider>
        <Dashboard onOpenSettings={vi.fn()} />
      </Provider>,
    );

    await screen.findByText("今日の収集するゴミ");
    expect(screen.getAllByText("燃えるゴミ").length).toBeGreaterThanOrEqual(1);
  });

  it("スケジュールが空の場合は収集なしメッセージを表示する", async () => {
    vi.mocked(window.electronAPI.getSchedule).mockResolvedValue({
      version: 2,
      entries: [],
    });

    render(
      <Provider>
        <Dashboard onOpenSettings={vi.fn()} />
      </Provider>,
    );

    await screen.findByText("今日のゴミ回収はありません");
  });

  it("設定ボタンがonOpenSettingsを呼ぶ", async () => {
    const onOpenSettings = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <Provider>
        <Dashboard onOpenSettings={onOpenSettings} />
      </Provider>,
    );

    await user.click(screen.getByText("設定"));
    expect(onOpenSettings).toHaveBeenCalledOnce();
  });
});
