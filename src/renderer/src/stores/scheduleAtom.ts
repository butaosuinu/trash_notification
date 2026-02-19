import { atom } from "jotai";
import type { TrashSchedule } from "../types/schedule";
import { SCHEDULE_VERSION } from "../types/schedule";

export const scheduleAtom = atom<TrashSchedule>({ version: SCHEDULE_VERSION, entries: [] });
