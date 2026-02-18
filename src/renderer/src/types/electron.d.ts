import type { TrashSchedule } from "./schedule";

type ElectronAPI = {
  getSchedule: () => Promise<TrashSchedule>;
  saveSchedule: (schedule: TrashSchedule) => Promise<void>;
  selectPdfFile: () => Promise<string | null>;
  parsePdfWithGemini: (filePath: string) => Promise<TrashSchedule>;
  getApiKey: () => Promise<string | null>;
  setApiKey: (key: string) => Promise<void>;
  quit: () => void;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- global augmentation requires interface
  interface Window {
    electronAPI: ElectronAPI;
  }
}
