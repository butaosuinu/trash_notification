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
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
