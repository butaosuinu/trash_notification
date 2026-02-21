import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("@/utils/logger");

vi.stubGlobal("electronAPI", {
  getSchedule: vi.fn().mockResolvedValue({ version: 2, entries: [] }),
  saveSchedule: vi.fn().mockResolvedValue(undefined),
  selectPdfFile: vi.fn().mockResolvedValue(null),
  parsePdfWithGemini: vi.fn().mockResolvedValue({ version: 2, entries: [] }),
  getApiKey: vi.fn().mockResolvedValue(null),
  setApiKey: vi.fn().mockResolvedValue(undefined),
  quit: vi.fn(),
  checkForUpdates: vi.fn().mockResolvedValue(undefined),
  installUpdate: vi.fn().mockResolvedValue(undefined),
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- cleanup stub
  onUpdateStatus: vi.fn().mockReturnValue(() => {}),
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- cleanup stub
  onUpdateProgress: vi.fn().mockReturnValue(() => {}),
  getNotificationSettings: vi.fn().mockResolvedValue({
    enabled: true,
    weeklyNotificationTime: "07:00",
    dayBeforeNotificationTime: "20:00",
  }),
  saveNotificationSettings: vi.fn().mockResolvedValue(undefined),
});
