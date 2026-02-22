import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "jotai";
import { Toast } from "../../common/Toast";
import { Settings } from "../Settings";
import { AUTOSAVE_DELAY_MS, SAVE_FEEDBACK_DELAY_MS } from "../../../constants/schedule";
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

  it("APIキー自動保存時にトースト通知が表示される", async () => {
    vi.mocked(window.electronAPI.getApiKey).mockResolvedValue(null);
    vi.mocked(window.electronAPI.setApiKey).mockResolvedValue(undefined);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderSettings();

    await waitFor(() => {
      expect(window.electronAPI.getApiKey).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText("API キーを入力");
    await user.type(input, "test-key");

    vi.advanceTimersByTime(AUTOSAVE_DELAY_MS);

    await screen.findByText("保存しました");
  });

  it("スケジュール自動保存時にトースト通知が表示される", async () => {
    vi.mocked(window.electronAPI.getSchedule).mockResolvedValue(mockSchedule);
    vi.mocked(window.electronAPI.saveSchedule).mockResolvedValue(undefined);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderSettings();

    await screen.findByDisplayValue("燃えるゴミ");

    const input = screen.getByDisplayValue("燃えるゴミ");
    await user.clear(input);
    await user.type(input, "プラ");

    vi.advanceTimersByTime(AUTOSAVE_DELAY_MS);

    await screen.findByText("保存しました");
  });

  it("通知設定変更時にトースト通知が表示される", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderSettings();

    await waitFor(() => {
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("checkbox"));

    await screen.findByText("保存しました");
  });

  it("トースト通知が2秒後に自動的に消える", async () => {
    vi.mocked(window.electronAPI.getApiKey).mockResolvedValue(null);
    vi.mocked(window.electronAPI.setApiKey).mockResolvedValue(undefined);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderSettings();

    await waitFor(() => {
      expect(window.electronAPI.getApiKey).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText("API キーを入力");
    await user.type(input, "key");

    vi.advanceTimersByTime(AUTOSAVE_DELAY_MS);

    await screen.findByText("保存しました");

    act(() => {
      vi.advanceTimersByTime(SAVE_FEEDBACK_DELAY_MS);
    });

    await waitFor(() => {
      expect(screen.queryByText("保存しました")).not.toBeInTheDocument();
    });
  });
});
