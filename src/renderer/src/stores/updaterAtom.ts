import { atom } from "jotai";

type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "not-available"
  | "downloading"
  | "ready"
  | "error";

type UpdateState = {
  status: UpdateStatus;
  version: string | null;
  error: string | null;
  progress: number;
};

export const updateStateAtom = atom<UpdateState>({
  status: "idle",
  version: null,
  error: null,
  progress: 0,
});
