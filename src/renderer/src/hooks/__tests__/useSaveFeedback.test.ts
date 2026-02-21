import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSaveFeedback } from "../useSaveFeedback";

describe("useSaveFeedback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("saved の初期値は false", () => {
    const { result } = renderHook(() => useSaveFeedback());
    expect(result.current.saved).toBe(false);
  });

  it("showSavedFeedback 呼び出し後に saved が true になる", () => {
    const { result } = renderHook(() => useSaveFeedback());

    act(() => {
      result.current.showSavedFeedback();
    });

    expect(result.current.saved).toBe(true);
  });

  it("タイムアウト後に saved が false に戻る", () => {
    const { result } = renderHook(() => useSaveFeedback());

    act(() => {
      result.current.showSavedFeedback();
    });

    expect(result.current.saved).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.saved).toBe(false);
  });
});
