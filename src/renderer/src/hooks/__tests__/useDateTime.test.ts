import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDateTime } from "../useDateTime";

describe("useDateTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 19, 14, 30, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("初期値が現在日時を返す", () => {
    const { result } = renderHook(() => useDateTime());
    expect(result.current.getFullYear()).toBe(2026);
    expect(result.current.getMonth()).toBe(1);
    expect(result.current.getDate()).toBe(19);
  });

  it("インターバル経過で日時が更新される", () => {
    const { result } = renderHook(() => useDateTime(1000));

    const initial = result.current.getTime();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.getTime()).toBeGreaterThan(initial);
  });

  it("アンマウント時にタイマーがクリアされる", () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const { unmount } = renderHook(() => useDateTime(1000));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
