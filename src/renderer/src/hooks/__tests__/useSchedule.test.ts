import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createElement } from "react";
import { Provider } from "jotai";
import { useSchedule } from "../useSchedule";
import type { TrashSchedule } from "../../types/schedule";

const mockSchedule: TrashSchedule = {
  version: 2,
  entries: [
    {
      id: "1",
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: 2 },
    },
  ],
};

function wrapper({ children }: { children: React.ReactNode }) {
  return createElement(Provider, null, children);
}

describe("useSchedule", () => {
  beforeEach(() => {
    vi.mocked(window.electronAPI.getSchedule).mockResolvedValue(mockSchedule);
    vi.mocked(window.electronAPI.saveSchedule).mockResolvedValue(undefined);
  });

  it("マウント時にgetScheduleが呼ばれスケジュールが取得される", async () => {
    const { result } = renderHook(() => useSchedule(), { wrapper });

    await waitFor(() => {
      expect(result.current.schedule).toEqual(mockSchedule);
    });

    expect(window.electronAPI.getSchedule).toHaveBeenCalledOnce();
  });

  it("saveScheduleがelectronAPIを呼びatomを更新する", async () => {
    const { result } = renderHook(() => useSchedule(), { wrapper });

    await waitFor(() => {
      expect(result.current.schedule).toEqual(mockSchedule);
    });

    const newSchedule: TrashSchedule = {
      version: 2,
      entries: [
        {
          id: "2",
          trash: { name: "資源ゴミ", icon: "recycle" },
          rule: { type: "weekly", dayOfWeek: 4 },
        },
      ],
    };

    await act(async () => {
      await result.current.saveSchedule(newSchedule);
    });

    expect(window.electronAPI.saveSchedule).toHaveBeenCalledWith(newSchedule);
    expect(result.current.schedule).toEqual(newSchedule);
  });
});
