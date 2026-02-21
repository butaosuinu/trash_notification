import { ipcMain, dialog } from "electron";
import { extractScheduleFromPdf } from "../services/geminiService";
import { getApiKey } from "../services/scheduleStore";
import { createLogger } from "../services/logger";

const log = createLogger("geminiHandlers");

export function registerGeminiHandlers(): void {
  ipcMain.handle("gemini:selectPdf", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });
    if (result.canceled || result.filePaths.length === 0) {
      log.info("PDF selection cancelled");
      return null;
    }
    log.info("PDF selected:", result.filePaths[0]);
    return result.filePaths[0];
  });

  ipcMain.handle("gemini:parsePdf", async (_event, filePath: string) => {
    log.info("Parsing PDF:", filePath);
    const apiKey = getApiKey();
    if (apiKey === null) {
      throw new Error("Gemini API キーが設定されていません");
    }
    return await extractScheduleFromPdf(apiKey, filePath);
  });
}
