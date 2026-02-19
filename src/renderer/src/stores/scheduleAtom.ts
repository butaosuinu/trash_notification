import { atom } from "jotai";
import type { TrashSchedule } from "../types/schedule";

export const scheduleAtom = atom<TrashSchedule>({ version: 2, entries: [] });
