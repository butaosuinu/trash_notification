// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadNotificationSettings, saveNotificationSettings } from "../notificationStore";

const { mockGet, mockSet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockSet: vi.fn(),
}));

vi.mock("electron-store", () => ({
  default: vi.fn().mockImplementation(() => ({
    get: mockGet,
    set: mockSet,
  })),
}));

vi.mock("../logger");

describe("notificationStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loadNotificationSettings", () => {
    it("保存された設定を返す", () => {
      const settings = {
        enabled: false,
        weeklyNotificationTime: "08:00",
        dayBeforeNotificationTime: "21:00",
      };
      mockGet.mockReturnValue(settings);

      const result = loadNotificationSettings();
      expect(result).toEqual(settings);
    });
  });

  describe("saveNotificationSettings", () => {
    it("設定を永続化する", () => {
      const settings = {
        enabled: true,
        weeklyNotificationTime: "07:00",
        dayBeforeNotificationTime: "20:00",
      };

      saveNotificationSettings(settings);
      expect(mockSet).toHaveBeenCalledWith("notification", settings);
    });
  });
});
