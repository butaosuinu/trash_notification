import type { TrashSchedule } from "./schedule";
import type { NotificationSettings } from "../../../shared/types/notification";

type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "not-available"
  | "downloading"
  | "ready"
  | "error";

type UpdateStatusPayload = {
  status: UpdateStatus;
  version?: string;
  error?: string;
};

type UpdateProgressPayload = {
  percent: number;
  bytesPerSecond: number;
  transferred: number;
  total: number;
};

type ElectronAPI = {
  getSchedule: () => Promise<TrashSchedule>;
  saveSchedule: (schedule: TrashSchedule) => Promise<void>;
  selectPdfFile: () => Promise<string | null>;
  parsePdfWithGemini: (filePath: string) => Promise<TrashSchedule>;
  getApiKey: () => Promise<string | null>;
  setApiKey: (key: string) => Promise<void>;
  quit: () => void;
  checkForUpdates: () => Promise<void>;
  installUpdate: () => Promise<void>;
  onUpdateStatus: (callback: (payload: UpdateStatusPayload) => void) => () => void;
  onUpdateProgress: (callback: (payload: UpdateProgressPayload) => void) => () => void;
  getNotificationSettings: () => Promise<NotificationSettings>;
  saveNotificationSettings: (settings: NotificationSettings) => Promise<void>;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- global augmentation requires interface
  interface Window {
    electronAPI: ElectronAPI;
  }
}
