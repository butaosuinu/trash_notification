import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

type TrashDay = {
  name: string;
  icon: string;
};

type TrashSchedule = Record<string, TrashDay>;

const EXTRACTION_PROMPT = `これは日本の自治体が配布しているゴミ収集カレンダーのPDFです。
曜日ごとのゴミ回収スケジュールを抽出してください。

各曜日（0=日曜日〜6=土曜日）について、回収されるゴミの種類を特定してください。
回収がない日は空文字列を使用してください。

以下の形式の有効なJSONのみを返してください:
{
  "0": { "name": "", "icon": "" },
  "1": { "name": "", "icon": "" },
  "2": { "name": "燃えるゴミ", "icon": "" },
  "3": { "name": "", "icon": "" },
  "4": { "name": "", "icon": "" },
  "5": { "name": "", "icon": "" },
  "6": { "name": "", "icon": "" }
}

注意:
- nameにはゴミの種類を日本語で記載してください
- iconは空文字列のままにしてください
- JSONのみを返し、説明は不要です`;

function parseScheduleJson(text: string): TrashSchedule {
  const jsonMatch = /\{[\s\S]*\}/.exec(text);
  if (jsonMatch === null) {
    throw new Error("PDFからスケジュールを抽出できませんでした");
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Gemini response validated by prompt
  return JSON.parse(jsonMatch[0]) as TrashSchedule;
}

export async function extractScheduleFromPdf(
  apiKey: string,
  filePath: string,
): Promise<TrashSchedule> {
  const client = new GoogleGenAI({ apiKey });

  const pdfBuffer = fs.readFileSync(filePath);
  const base64Data = pdfBuffer.toString("base64");

  const response = await client.models.generateContent({
    model: "gemini-2.0-flash",
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
