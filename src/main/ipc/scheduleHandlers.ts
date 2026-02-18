import { ipcMain } from "electron";
import { loadSchedule, saveSchedule, getApiKey, setApiKey } from "../services/scheduleStore";

export function registerScheduleHandlers(): void {
  ipcMain.handle("schedule:get", () => loadSchedule());

  ipcMain.handle("schedule:save", (_event, schedule: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- schedule comes from trusted IPC
    saveSchedule(schedule as Record<string, { name: string; icon: string }>);
  });

  ipcMain.handle("settings:getApiKey", () => getApiKey());

  ipcMain.handle("settings:setApiKey", (_event, key: string) => {
    setApiKey(key);
  });
}
