import { vi } from "vitest";
import type { TrashSchedule } from "../../types/schedule";

const DEFAULT_MOCK_SCHEDULE: TrashSchedule = {
  "0": { name: "", icon: "" },
  "1": { name: "", icon: "" },
  "2": { name: "燃えるゴミ", icon: "burn" },
  "3": { name: "ビン・缶・ペットボトル", icon: "bottle" },
  "4": { name: "資源ゴミ", icon: "recycle" },
  "5": { name: "燃えるゴミ", icon: "burn" },
  "6": { name: "", icon: "" },
};

export function createMockElectronAPI() {
  return {
    getSchedule: vi.fn().mockResolvedValue(DEFAULT_MOCK_SCHEDULE),
    saveSchedule: vi.fn().mockResolvedValue(undefined),
    selectPdfFile: vi.fn().mockResolvedValue(null),
    parsePdfWithGemini: vi.fn().mockResolvedValue({}),
    getApiKey: vi.fn().mockResolvedValue(null),
    setApiKey: vi.fn().mockResolvedValue(undefined),
    quit: vi.fn(),
  };
}
