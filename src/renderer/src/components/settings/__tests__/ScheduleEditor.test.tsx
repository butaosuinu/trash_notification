import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "jotai";
import { ScheduleEditor } from "../ScheduleEditor";
import { AUTOSAVE_DELAY_MS } from "../../../constants/schedule";
import type { TrashSchedule } from "../../../types/schedule";

const mockSchedule: TrashSchedule = {
  version: 2,
  entries: [
    {
      id: "entry-1",
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: 2 },
    },
    {
      id: "entry-2",
      trash: { name: "資源ゴミ", icon: "recycle" },
      rule: { type: "weekly", dayOfWeek: 4 },
    },
  ],
};

function renderScheduleEditor() {
  return render(
    <Provider>
      <ScheduleEditor />
    </Provider>,
  );
}

describe("ScheduleEditor", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(window.electronAPI.getSchedule).mockResolvedValue(mockSchedule);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("読み込んだエントリーが表示される", async () => {
    renderScheduleEditor();

    await screen.findByDisplayValue("燃えるゴミ");
    expect(screen.getByDisplayValue("資源ゴミ")).toBeInTheDocument();
  });

  it("エントリーを追加ボタンで新規行が追加される", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderScheduleEditor();

    await screen.findByRole("button", { name: "エントリーを追加" });

    await user.click(screen.getByRole("button", { name: "エントリーを追加" }));

    const inputs = screen.getAllByPlaceholderText("ゴミの種類");
    expect(inputs).toHaveLength(3);
  });

  it("エントリーを削除できる", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderScheduleEditor();

    await screen.findByDisplayValue("燃えるゴミ");

    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    await user.click(deleteButtons[0]);

    expect(screen.queryByDisplayValue("燃えるゴミ")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("資源ゴミ")).toBeInTheDocument();
  });

  it("エントリー名を変更できる", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderScheduleEditor();

    await screen.findByDisplayValue("燃えるゴミ");

    const input = screen.getByDisplayValue("燃えるゴミ");
    await user.clear(input);
    await user.type(input, "プラスチック");

    expect(screen.getByDisplayValue("プラスチック")).toBeInTheDocument();
  });

  it("エントリー変更後にデバウンスで自動保存される", async () => {
    vi.mocked(window.electronAPI.saveSchedule).mockResolvedValue(undefined);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderScheduleEditor();

    await screen.findByDisplayValue("燃えるゴミ");

    const input = screen.getByDisplayValue("燃えるゴミ");
    await user.clear(input);
    await user.type(input, "プラ");

    vi.advanceTimersByTime(AUTOSAVE_DELAY_MS);

    await waitFor(() => {
      expect(window.electronAPI.saveSchedule).toHaveBeenCalled();
    });
  });

  it("自動保存のIPC完了後にユーザーの入力が失われない", async () => {
    const SAVE_DELAY = 100;
    vi.mocked(window.electronAPI.saveSchedule).mockImplementation(async () => {
      // eslint-disable-next-line promise/avoid-new -- delayed mock required for race condition test
      await new Promise<void>((resolve) => {
        setTimeout(resolve, SAVE_DELAY);
      });
    });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderScheduleEditor();

    await screen.findByDisplayValue("燃えるゴミ");

    const input = screen.getByDisplayValue("燃えるゴミ");
    await user.clear(input);
    await user.type(input, "A");

    vi.advanceTimersByTime(AUTOSAVE_DELAY_MS);

    await user.type(input, "B");
    expect(screen.getByDisplayValue("AB")).toBeInTheDocument();

    vi.advanceTimersByTime(SAVE_DELAY);
    await waitFor(() => {
      expect(window.electronAPI.saveSchedule).toHaveBeenCalled();
    });

    expect(screen.getByDisplayValue("AB")).toBeInTheDocument();
  });
});
