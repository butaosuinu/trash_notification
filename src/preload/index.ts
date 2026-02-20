import { contextBridge, ipcRenderer } from "electron";

const electronAPI = {
  getSchedule: async () =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- ipcRenderer.invoke returns any
    await ipcRenderer.invoke("schedule:get"),
  saveSchedule: async (schedule: unknown) => {
    await ipcRenderer.invoke("schedule:save", schedule);
  },
  selectPdfFile: async () =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- ipcRenderer.invoke returns any
    await ipcRenderer.invoke("gemini:selectPdf"),
  parsePdfWithGemini: async (filePath: string) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- ipcRenderer.invoke returns any
    await ipcRenderer.invoke("gemini:parsePdf", filePath),
  getApiKey: async () =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- ipcRenderer.invoke returns any
    await ipcRenderer.invoke("settings:getApiKey"),
  setApiKey: async (key: string) => {
    await ipcRenderer.invoke("settings:setApiKey", key);
  },
  quit: (): void => {
    ipcRenderer.send("app:quit");
  },
  checkForUpdates: async () => {
    await ipcRenderer.invoke("updater:check");
  },
  installUpdate: async () => {
    await ipcRenderer.invoke("updater:install");
  },
  onUpdateStatus: (callback: (payload: unknown) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, payload: unknown): void => {
      callback(payload);
    };
    ipcRenderer.on("updater:status", listener);
    return () => {
      ipcRenderer.removeListener("updater:status", listener);
    };
  },
  onUpdateProgress: (callback: (payload: unknown) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, payload: unknown): void => {
      callback(payload);
    };
    ipcRenderer.on("updater:progress", listener);
    return () => {
      ipcRenderer.removeListener("updater:progress", listener);
    };
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
