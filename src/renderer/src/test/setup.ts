import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.stubGlobal("electronAPI", {
  getSchedule: vi.fn().mockResolvedValue({ version: 2, entries: [] }),
  saveSchedule: vi.fn().mockResolvedValue(undefined),
  selectPdfFile: vi.fn().mockResolvedValue(null),
  parsePdfWithGemini: vi.fn().mockResolvedValue({ version: 2, entries: [] }),
  getApiKey: vi.fn().mockResolvedValue(null),
  setApiKey: vi.fn().mockResolvedValue(undefined),
  quit: vi.fn(),
});
