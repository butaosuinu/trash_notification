import { vi } from "vitest";
import type { TrashSchedule } from "../../types/schedule";

const DEFAULT_MOCK_SCHEDULE: TrashSchedule = {
  version: 2,
  entries: [
    {
      id: "mock-1",
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: 2 },
    },
    {
      id: "mock-2",
      trash: { name: "ビン・缶・ペットボトル", icon: "bottle" },
      rule: { type: "weekly", dayOfWeek: 3 },
    },
    {
      id: "mock-3",
      trash: { name: "資源ゴミ", icon: "recycle" },
      rule: { type: "weekly", dayOfWeek: 4 },
    },
    {
      id: "mock-4",
      trash: { name: "燃えるゴミ", icon: "burn" },
      rule: { type: "weekly", dayOfWeek: 5 },
    },
  ],
};

export function createMockElectronAPI() {
  return {
    getSchedule: vi.fn().mockResolvedValue(DEFAULT_MOCK_SCHEDULE),
    saveSchedule: vi.fn().mockResolvedValue(undefined),
    selectPdfFile: vi.fn().mockResolvedValue(null),
    parsePdfWithGemini: vi.fn().mockResolvedValue({ version: 2, entries: [] }),
    getApiKey: vi.fn().mockResolvedValue(null),
    setApiKey: vi.fn().mockResolvedValue(undefined),
    quit: vi.fn(),
  };
}
