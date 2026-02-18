import { atom } from "jotai";

export type ViewMode = "dashboard" | "settings";

export const viewModeAtom = atom<ViewMode>("dashboard");
