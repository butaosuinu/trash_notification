import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "jotai";
import { PdfImport } from "../PdfImport";
import type { TrashSchedule } from "../../../types/schedule";

const extractedSchedule: TrashSchedule = {
  version: 2,
  entries: [
    {
      id: "ext-1",
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: 2 },
    },
    {
      id: "ext-2",
      trash: { name: "資源ゴミ", icon: "recycle" },
      rule: { type: "nthWeekday", dayOfWeek: 3, weekNumbers: [1, 3] },
    },
  ],
};

function renderPdfImport() {
  return render(
    <Provider>
      <PdfImport />
    </Provider>,
  );
}

describe("PdfImport", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("PDF選択ボタンが表示される", () => {
    renderPdfImport();
    expect(screen.getByText("PDF を選択")).toBeInTheDocument();
  });

  it("PDF選択後にファイルパスと解析ボタンが表示される", async () => {
    vi.mocked(window.electronAPI.selectPdfFile).mockResolvedValue("/path/to/schedule.pdf");
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderPdfImport();
    await user.click(screen.getByText("PDF を選択"));

    await waitFor(() => {
      expect(screen.getByText("/path/to/schedule.pdf")).toBeInTheDocument();
      expect(screen.getByText("解析")).toBeInTheDocument();
    });
  });

  it("解析後にプレビューテーブルが表示される", async () => {
    vi.mocked(window.electronAPI.selectPdfFile).mockResolvedValue("/path/to/schedule.pdf");
    vi.mocked(window.electronAPI.parsePdfWithGemini).mockResolvedValue(extractedSchedule);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderPdfImport();
    await user.click(screen.getByText("PDF を選択"));

    await waitFor(() => {
      expect(screen.getByText("解析")).toBeInTheDocument();
    });

    await user.click(screen.getByText("解析"));

    await waitFor(() => {
      expect(screen.getByText("抽出結果のプレビュー")).toBeInTheDocument();
      expect(screen.getByText("燃えるゴミ")).toBeInTheDocument();
      expect(screen.getByText("資源ゴミ")).toBeInTheDocument();
    });
  });

  it("キャンセルでリセットされる", async () => {
    vi.mocked(window.electronAPI.selectPdfFile).mockResolvedValue("/path/to/schedule.pdf");
    vi.mocked(window.electronAPI.parsePdfWithGemini).mockResolvedValue(extractedSchedule);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderPdfImport();
    await user.click(screen.getByText("PDF を選択"));

    await waitFor(() => {
      expect(screen.getByText("解析")).toBeInTheDocument();
    });

    await user.click(screen.getByText("解析"));

    await waitFor(() => {
      expect(screen.getByText("キャンセル")).toBeInTheDocument();
    });

    await user.click(screen.getByText("キャンセル"));

    await waitFor(() => {
      expect(screen.queryByText("抽出結果のプレビュー")).not.toBeInTheDocument();
      expect(screen.queryByText("/path/to/schedule.pdf")).not.toBeInTheDocument();
    });
  });

  it("エラー時にエラーメッセージが表示される", async () => {
    vi.mocked(window.electronAPI.selectPdfFile).mockResolvedValue("/path/to/file.pdf");
    vi.mocked(window.electronAPI.parsePdfWithGemini).mockRejectedValue(new Error("API接続エラー"));
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderPdfImport();
    await user.click(screen.getByText("PDF を選択"));

    await waitFor(() => {
      expect(screen.getByText("解析")).toBeInTheDocument();
    });

    await user.click(screen.getByText("解析"));

    await waitFor(() => {
      expect(screen.getByText("API接続エラー")).toBeInTheDocument();
    });
  });

  it("保存ボタンでsaveScheduleが呼ばれる", async () => {
    vi.mocked(window.electronAPI.selectPdfFile).mockResolvedValue("/path/to/schedule.pdf");
    vi.mocked(window.electronAPI.parsePdfWithGemini).mockResolvedValue(extractedSchedule);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderPdfImport();
    await user.click(screen.getByText("PDF を選択"));

    await waitFor(() => {
      expect(screen.getByText("解析")).toBeInTheDocument();
    });

    await user.click(screen.getByText("解析"));

    await waitFor(() => {
      expect(screen.getByText("保存")).toBeInTheDocument();
    });

    await user.click(screen.getByText("保存"));

    await waitFor(() => {
      expect(window.electronAPI.saveSchedule).toHaveBeenCalledWith(extractedSchedule);
    });
  });
});
