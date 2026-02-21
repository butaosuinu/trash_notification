import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useGeminiImport } from "../useGeminiImport";
import type { TrashSchedule } from "../../types/schedule";

vi.mock("@/utils/logger");

const mockExtractedSchedule: TrashSchedule = {
  version: 2,
  entries: [
    {
      id: "1",
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: 2 },
    },
  ],
};

describe("useGeminiImport", () => {
  beforeEach(() => {
    vi.mocked(window.electronAPI.selectPdfFile).mockReset().mockResolvedValue(null);
    vi.mocked(window.electronAPI.parsePdfWithGemini)
      .mockReset()
      .mockResolvedValue(mockExtractedSchedule);
  });

  it("初期状態が正しい", () => {
    const { result } = renderHook(() => useGeminiImport());

    expect(result.current.filePath).toBeNull();
    expect(result.current.extractedSchedule).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("selectFileでfilePathが設定される", async () => {
    vi.mocked(window.electronAPI.selectPdfFile).mockResolvedValue("/path/to/file.pdf");
    const { result } = renderHook(() => useGeminiImport());

    await act(async () => {
      await result.current.selectFile();
    });

    expect(result.current.filePath).toBe("/path/to/file.pdf");
  });

  it("selectFileでキャンセルした場合filePathはnull", async () => {
    vi.mocked(window.electronAPI.selectPdfFile).mockResolvedValue(null);
    const { result } = renderHook(() => useGeminiImport());

    await act(async () => {
      await result.current.selectFile();
    });

    expect(result.current.filePath).toBeNull();
  });

  it("extractScheduleでスケジュールが取得される", async () => {
    vi.mocked(window.electronAPI.selectPdfFile).mockResolvedValue("/path/to/file.pdf");
    const { result } = renderHook(() => useGeminiImport());

    await act(async () => {
      await result.current.selectFile();
    });

    await act(async () => {
      await result.current.extractSchedule();
    });

    await waitFor(() => {
      expect(result.current.extractedSchedule).toEqual(mockExtractedSchedule);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("extractScheduleがfilePathなしでは実行されない", async () => {
    const { result } = renderHook(() => useGeminiImport());

    await act(async () => {
      await result.current.extractSchedule();
    });

    expect(window.electronAPI.parsePdfWithGemini).not.toHaveBeenCalled();
  });

  it("API失敗時にerrorがセットされる", async () => {
    vi.mocked(window.electronAPI.selectPdfFile).mockResolvedValue("/path/to/file.pdf");
    vi.mocked(window.electronAPI.parsePdfWithGemini).mockRejectedValue(new Error("解析エラー"));
    const { result } = renderHook(() => useGeminiImport());

    await act(async () => {
      await result.current.selectFile();
    });

    await act(async () => {
      await result.current.extractSchedule();
    });

    await waitFor(() => {
      expect(result.current.error).toBe("解析エラー");
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("resetで全stateが初期化される", async () => {
    vi.mocked(window.electronAPI.selectPdfFile).mockResolvedValue("/path/to/file.pdf");
    const { result } = renderHook(() => useGeminiImport());

    await act(async () => {
      await result.current.selectFile();
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.filePath).toBeNull();
    expect(result.current.extractedSchedule).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
