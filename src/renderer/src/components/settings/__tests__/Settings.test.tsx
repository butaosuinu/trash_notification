import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "jotai";
import { Toast } from "../../common/Toast";
import { Settings } from "../Settings";
import type { TrashSchedule } from "../../../types/schedule";

const mockSchedule: TrashSchedule = {
  version: 2,
  entries: [
    {
      id: "entry-1",
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: 2 },
    },
  ],
};

function renderSettings() {
  return render(
    <Provider>
      <Toast />
      <Settings onBack={vi.fn()} />
    </Provider>,
  );
}

describe("Settings - トースト通知", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("APIキー保存時にトースト通知が表示される", async () => {
    vi.mocked(window.electronAPI.setApiKey).mockResolvedValue(undefined);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderSettings();

    const input = screen.getByPlaceholderText("API キーを入力");
    await user.type(input, "test-key");

    const saveButtons = screen.getAllByRole("button", { name: "保存" });
    await user.click(saveButtons[0]);

    await screen.findByText("保存しました");
  });

  it("スケジュール保存時にトースト通知が表示される", async () => {
    vi.mocked(window.electronAPI.getSchedule).mockResolvedValue(mockSchedule);
    vi.mocked(window.electronAPI.saveSchedule).mockResolvedValue(undefined);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderSettings();

    await screen.findByDisplayValue("燃えるゴミ");

    const saveButtons = screen.getAllByRole("button", { name: "保存" });
    await user.click(saveButtons[1]);

    await screen.findByText("保存しました");
  });

  it("通知設定の保存ボタンクリック時にトースト通知が表示される", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderSettings();

    await screen.findByText("通知設定");

    const saveButtons = screen.getAllByRole("button", { name: "保存" });
    await user.click(saveButtons[2]);

    await screen.findByText("保存しました");
  });

  it("トースト通知が2秒後に自動的に消える", async () => {
    vi.mocked(window.electronAPI.setApiKey).mockResolvedValue(undefined);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderSettings();

    const input = screen.getByPlaceholderText("API キーを入力");
    await user.type(input, "key");

    const saveButtons = screen.getAllByRole("button", { name: "保存" });
    await user.click(saveButtons[0]);

    await screen.findByText("保存しました");

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.queryByText("保存しました")).not.toBeInTheDocument();
    });
  });
});
