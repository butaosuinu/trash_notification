// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { extractScheduleFromPdf } from "../geminiService";

const { mockGenerateContent } = vi.hoisted(() => ({
  mockGenerateContent: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
}));

vi.mock("node:fs", () => ({
  readFileSync: vi.fn().mockReturnValue(Buffer.from("fake-pdf-content")),
}));

vi.mock("node:crypto", () => ({
  randomUUID: vi.fn().mockReturnValue("mock-uuid"),
}));

vi.mock("electron-store", () => ({
  default: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    set: vi.fn(),
  })),
}));

vi.mock("../logger");

describe("geminiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("extractScheduleFromPdf", () => {
    it("V2 JSON応答を正しくパースする", async () => {
      const v2Response = JSON.stringify({
        version: 2,
        entries: [
          {
            trash: { name: "燃えるゴミ", icon: "burn" },
            rule: { type: "weekly", dayOfWeek: 2 },
          },
        ],
      });

      mockGenerateContent.mockResolvedValue({ text: v2Response });

      const result = await extractScheduleFromPdf("api-key", "/path/to/file.pdf");

      expect(result.version).toBe(2);
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].trash.name).toBe("燃えるゴミ");
      expect(result.entries[0].id).toBe("mock-uuid");
    });

    it("V1フォールバック応答をマイグレーションする", async () => {
      const v1Response = JSON.stringify({
        "2": { name: "燃えるゴミ", icon: "burn" },
        "4": { name: "資源ゴミ", icon: "recycle" },
      });

      mockGenerateContent.mockResolvedValue({ text: v1Response });

      const result = await extractScheduleFromPdf("api-key", "/path/to/file.pdf");

      expect(result.version).toBe(2);
      expect(result.entries).toHaveLength(2);
    });

    it("JSONを含まないテキストでエラーをthrowする", async () => {
      mockGenerateContent.mockResolvedValue({ text: "スケジュールが見つかりません" });

      await expect(extractScheduleFromPdf("api-key", "/path/to/file.pdf")).rejects.toThrow(
        "PDFからスケジュールを抽出できませんでした",
      );
    });

    it("空のレスポンスでエラーをthrowする", async () => {
      mockGenerateContent.mockResolvedValue({ text: "" });

      await expect(extractScheduleFromPdf("api-key", "/path/to/file.pdf")).rejects.toThrow(
        "PDFからスケジュールを抽出できませんでした",
      );
    });

    it("テキスト中に埋め込まれたJSONを抽出する", async () => {
      const responseWithExtraText = `以下がスケジュールです:
${JSON.stringify({
  version: 2,
  entries: [
    { trash: { name: "燃えるゴミ", icon: "burn" }, rule: { type: "weekly", dayOfWeek: 2 } },
  ],
})}
以上です。`;

      mockGenerateContent.mockResolvedValue({ text: responseWithExtraText });

      const result = await extractScheduleFromPdf("api-key", "/path/to/file.pdf");

      expect(result.version).toBe(2);
      expect(result.entries[0].trash.name).toBe("燃えるゴミ");
    });
  });
});
