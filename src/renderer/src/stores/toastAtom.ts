import { atom } from "jotai";

type ToastState = {
  readonly message: string;
  readonly visible: boolean;
};

export const toastAtom = atom<ToastState>({ message: "", visible: false });
