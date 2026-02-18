import { ipcMain, dialog } from "electron";
import { extractScheduleFromPdf } from "../services/geminiService";
import { getApiKey } from "../services/scheduleStore";

export function registerGeminiHandlers(): void {
  ipcMain.handle("gemini:selectPdf", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });
    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    return result.filePaths[0];
  });

  ipcMain.handle("gemini:parsePdf", async (_event, filePath: string) => {
    const apiKey = getApiKey();
    if (apiKey === null) {
      throw new Error("Gemini API キーが設定されていません");
    }
    return await extractScheduleFromPdf(apiKey, filePath);
  });
}
