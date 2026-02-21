import { ipcMain } from "electron";
import {
  loadSchedule,
  saveSchedule,
  getApiKey,
  setApiKey,
  type TrashSchedule,
} from "../services/scheduleStore";
import { createLogger } from "../services/logger";

const log = createLogger("scheduleHandlers");

export function registerScheduleHandlers(): void {
  ipcMain.handle("schedule:get", () => {
    log.debug("schedule:get");
    return loadSchedule();
  });

  ipcMain.handle("schedule:save", (_event, schedule: unknown) => {
    log.debug("schedule:save");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- schedule comes from trusted IPC
    saveSchedule(schedule as TrashSchedule);
  });

  ipcMain.handle("settings:getApiKey", () => {
    log.debug("settings:getApiKey");
    return getApiKey();
  });

  ipcMain.handle("settings:setApiKey", (_event, key: string) => {
    log.debug("settings:setApiKey");
    setApiKey(key);
  });
}
