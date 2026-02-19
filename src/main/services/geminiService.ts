import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import { randomUUID } from "node:crypto";
import { migrateV1ToV2, SCHEDULE_VERSION, type TrashSchedule } from "./scheduleStore";

const EXTRACTION_PROMPT = `これは日本の自治体が配布しているゴミ収集カレンダーのPDFです。
ゴミ回収スケジュールを抽出してください。

各ゴミの種類について、回収パターンを判定し、以下のルール種別を使い分けてください:
- "weekly": 毎週同じ曜日に回収（dayOfWeek: 0=日曜〜6=土曜）
- "biweekly": 隔週回収（dayOfWeek + referenceDate: 回収日のひとつをYYYY-MM-DD形式で）
- "nthWeekday": 第N曜日に回収（dayOfWeek + weekNumbers: [1,3] のように第何週かの配列）
- "specificDates": 不規則な日付で回収（dates: ["YYYY-MM-DD", ...] の配列）

以下の形式の有効なJSONのみを返してください:
{
  "version": 2,
  "entries": [
    { "trash": { "name": "燃えるゴミ", "icon": "burn" }, "rule": { "type": "weekly", "dayOfWeek": 2 } },
    { "trash": { "name": "資源ゴミ", "icon": "recycle" }, "rule": { "type": "nthWeekday", "dayOfWeek": 3, "weekNumbers": [1, 3] } },
    { "trash": { "name": "粗大ゴミ", "icon": "oversized" }, "rule": { "type": "specificDates", "dates": ["2026-03-15", "2026-04-19"] } }
  ]
}

注意:
- nameにはゴミの種類を日本語で記載してください
- iconには以下のキーから最も適切なものを設定してください:
  burn=燃えるゴミ/可燃ゴミ, nonburn=燃えないゴミ/不燃ゴミ, recycle=資源ゴミ/リサイクル,
  plastic=プラスチック/プラ容器, bottle=ビン/ガラスびん, can=缶/アルミ缶/スチール缶,
  paper=古紙/新聞/雑誌/ダンボール, cloth=古布/衣類, oversized=粗大ゴミ/大型ゴミ,
  hazardous=有害ゴミ/蛍光管/水銀, battery=乾電池/電池, other=上記に該当しないもの
- 同じゴミの種類が複数の曜日で回収される場合、曜日ごとに別エントリーにしてください
- JSONのみを返し、説明は不要です`;

function isV2Response(data: unknown): data is TrashSchedule {
  return (
    typeof data === "object" &&
    data !== null &&
    "version" in data &&
    (data as Record<string, unknown>).version === SCHEDULE_VERSION
  );
}

function assignIds(schedule: TrashSchedule): TrashSchedule {
  return {
    version: SCHEDULE_VERSION,
    entries: schedule.entries.map((entry) => ({
      ...entry,
      id: randomUUID(),
    })),
  };
}

function parseScheduleJson(text: string): TrashSchedule {
  const jsonMatch = /\{[\s\S]*\}/.exec(text);
  if (jsonMatch === null) {
    throw new Error("PDFからスケジュールを抽出できませんでした");
  }

  const parsed = JSON.parse(jsonMatch[0]) as unknown;

  if (isV2Response(parsed)) {
    return assignIds(parsed);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- V1 fallback
  return migrateV1ToV2(parsed as Record<string, { name: string; icon: string }>);
}

export async function extractScheduleFromPdf(
  apiKey: string,
  filePath: string,
): Promise<TrashSchedule> {
  const client = new GoogleGenAI({ apiKey });

  const pdfBuffer = fs.readFileSync(filePath);
  const base64Data = pdfBuffer.toString("base64");

  const response = await client.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Data,
            },
          },
          { text: EXTRACTION_PROMPT },
        ],
      },
    ],
  });

  const text = response.text ?? "";
  return parseScheduleJson(text);
}
