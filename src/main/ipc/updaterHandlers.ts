import { ipcMain } from "electron";
import { checkForUpdates, installUpdate } from "../services/updaterService";

export function registerUpdaterHandlers(): void {
  ipcMain.handle("updater:check", () => {
    checkForUpdates();
  });

  ipcMain.handle("updater:install", () => {
    installUpdate();
  });
}
