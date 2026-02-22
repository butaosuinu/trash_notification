import { Check } from "lucide-react";
import { useAtomValue } from "jotai";
import { ICON_SIZE } from "../../constants/styles";
import { toastAtom } from "../../stores/toastAtom";

export function Toast() {
  const toast = useAtomValue(toastAtom);

  if (!toast.visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50">
      <div className="pointer-events-auto animate-toast-in glass rounded-lg border-frost-success/30 px-4 py-2 text-sm text-emerald-400 shadow-lg">
        <div className="flex items-center gap-2">
          <Check size={ICON_SIZE} />
          <span>{toast.message}</span>
        </div>
      </div>
    </div>
  );
}
