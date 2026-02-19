import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "jotai";
import { ScheduleEditor } from "../ScheduleEditor";
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

    await waitFor(() => {
      expect(screen.getByDisplayValue("燃えるゴミ")).toBeInTheDocument();
      expect(screen.getByDisplayValue("資源ゴミ")).toBeInTheDocument();
    });
  });

  it("エントリーを追加ボタンで新規行が追加される", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderScheduleEditor();

    await waitFor(() => {
      expect(screen.getByText("エントリーを追加")).toBeInTheDocument();
    });

    await user.click(screen.getByText("エントリーを追加"));

    const inputs = screen.getAllByPlaceholderText("ゴミの種類");
    expect(inputs).toHaveLength(3);
  });

  it("エントリーを削除できる", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderScheduleEditor();

    await waitFor(() => {
      expect(screen.getByDisplayValue("燃えるゴミ")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("削除");
    await user.click(deleteButtons[0]);

    expect(screen.queryByDisplayValue("燃えるゴミ")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("資源ゴミ")).toBeInTheDocument();
  });

  it("エントリー名を変更できる", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderScheduleEditor();

    await waitFor(() => {
      expect(screen.getByDisplayValue("燃えるゴミ")).toBeInTheDocument();
    });

    const input = screen.getByDisplayValue("燃えるゴミ");
    await user.clear(input);
    await user.type(input, "プラスチック");

    expect(screen.getByDisplayValue("プラスチック")).toBeInTheDocument();
  });

  it("保存ボタンでsaveScheduleが呼ばれ保存済みフィードバックが表示される", async () => {
    vi.mocked(window.electronAPI.saveSchedule).mockResolvedValue(undefined);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderScheduleEditor();

    await waitFor(() => {
      expect(screen.getByDisplayValue("燃えるゴミ")).toBeInTheDocument();
    });

    await user.click(screen.getByText("保存"));

    await waitFor(() => {
      expect(window.electronAPI.saveSchedule).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("保存済み")).toBeInTheDocument();
    });
  });
});
