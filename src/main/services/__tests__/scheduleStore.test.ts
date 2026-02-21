// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  migrateV1ToV2,
  migrateStoreIfNeeded,
  loadSchedule,
  saveSchedule,
  getApiKey,
  setApiKey,
} from "../scheduleStore";

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

vi.mock("node:crypto", () => ({
  randomUUID: vi.fn().mockReturnValue("mock-uuid"),
}));

vi.mock("../logger");

function mockStoreData(migratedVersion: string | null, schedule: unknown): void {
  mockGet.mockImplementation((key: string) =>
    key === "migratedVersion" ? migratedVersion : schedule,
  );
}

describe("scheduleStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("migrateV1ToV2", () => {
    it("V1形式をV2形式に変換する", () => {
      const v1 = {
        "2": { name: "燃えるゴミ", icon: "burn" },
        "4": { name: "資源ゴミ", icon: "recycle" },
      };

      const result = migrateV1ToV2(v1);

      expect(result.version).toBe(2);
      expect(result.entries).toHaveLength(2);
      expect(result.entries[0]).toEqual({
        id: "mock-uuid",
        trash: { name: "燃えるゴミ", icon: "burn" },
        rule: { type: "weekly", dayOfWeek: 2 },
      });
      expect(result.entries[1]).toEqual({
        id: "mock-uuid",
        trash: { name: "資源ゴミ", icon: "recycle" },
        rule: { type: "weekly", dayOfWeek: 4 },
      });
    });

    it("空のnameを持つエントリーは除外する", () => {
      const v1 = {
        "0": { name: "", icon: "" },
        "2": { name: "燃えるゴミ", icon: "burn" },
      };

      const result = migrateV1ToV2(v1);
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].trash.name).toBe("燃えるゴミ");
    });

    it("空のV1データから空のV2スケジュールを生成する", () => {
      const result = migrateV1ToV2({});
      expect(result).toEqual({ version: 2, entries: [] });
    });
  });

  describe("migrateStoreIfNeeded", () => {
    it("バージョン一致時はマイグレーションをスキップする", () => {
      mockStoreData("1.0.0", undefined);

      migrateStoreIfNeeded("1.0.0");

      expect(mockSet).not.toHaveBeenCalled();
    });

    it("V1データをV2にマイグレーションして永続化する", () => {
      mockStoreData(null, { "2": { name: "燃えるゴミ", icon: "burn" } });

      migrateStoreIfNeeded("1.0.0");

      expect(mockSet).toHaveBeenCalledWith("schedule", expect.objectContaining({ version: 2 }));
      expect(mockSet).toHaveBeenCalledWith("migratedVersion", "1.0.0");
    });

    it("NthWeekdayレガシー形式をマイグレーションして永続化する", () => {
      mockStoreData(null, {
        version: 2,
        entries: [
          {
            id: "1",
            trash: { name: "粗大ゴミ", icon: "large" },
            rule: { type: "nthWeekday", dayOfWeek: 3, weekNumbers: [1, 3] },
          },
        ],
      });

      migrateStoreIfNeeded("1.0.0");

      expect(mockSet).toHaveBeenCalledWith(
        "schedule",
        expect.objectContaining({
          version: 2,
          entries: [
            expect.objectContaining({
              rule: { type: "nthWeekday", patterns: [{ dayOfWeek: 3, weekNumbers: [1, 3] }] },
            }),
          ],
        }),
      );
      expect(mockSet).toHaveBeenCalledWith("migratedVersion", "1.0.0");
    });

    it("マイグレーション不要なV2データはスケジュールを書き込まない", () => {
      mockStoreData(null, {
        version: 2,
        entries: [
          {
            id: "1",
            trash: { name: "燃えるゴミ", icon: "burn" },
            rule: { type: "weekly", dayOfWeek: 2 },
          },
        ],
      });

      migrateStoreIfNeeded("1.0.0");

      expect(mockSet).not.toHaveBeenCalledWith("schedule", expect.anything());
      expect(mockSet).toHaveBeenCalledWith("migratedVersion", "1.0.0");
    });
  });

  describe("loadSchedule", () => {
    it("ストアのデータをそのまま返却する", () => {
      const v2Data = {
        version: 2,
        entries: [
          {
            id: "1",
            trash: { name: "燃えるゴミ", icon: "burn" },
            rule: { type: "weekly", dayOfWeek: 2 },
          },
        ],
      };
      mockGet.mockReturnValue(v2Data);

      const result = loadSchedule();
      expect(result).toEqual(v2Data);
      expect(mockSet).not.toHaveBeenCalled();
    });
  });

  describe("saveSchedule", () => {
    it("スケジュールを永続化する", () => {
      const schedule = { version: 2 as const, entries: [] };
      saveSchedule(schedule);
      expect(mockSet).toHaveBeenCalledWith("schedule", schedule);
    });
  });

  describe("getApiKey / setApiKey", () => {
    it("APIキーを取得する", () => {
      mockGet.mockReturnValue("test-key");
      expect(getApiKey()).toBe("test-key");
    });

    it("APIキーがない場合nullを返す", () => {
      mockGet.mockReturnValue(null);
      expect(getApiKey()).toBeNull();
    });

    it("APIキーを保存する", () => {
      setApiKey("new-key");
      expect(mockSet).toHaveBeenCalledWith("apiKey", "new-key");
    });
  });
});
