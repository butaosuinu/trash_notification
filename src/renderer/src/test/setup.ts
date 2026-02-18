import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

vi.stubGlobal("electronAPI", {
  getSchedule: vi.fn().mockResolvedValue({}),
  saveSchedule: vi.fn().mockResolvedValue(undefined),
  selectPdfFile: vi.fn().mockResolvedValue(null),
  parsePdfWithGemini: vi.fn().mockResolvedValue({}),
  getApiKey: vi.fn().mockResolvedValue(null),
  setApiKey: vi.fn().mockResolvedValue(undefined),
  quit: vi.fn(),
});

afterEach(() => {
  cleanup();
});
