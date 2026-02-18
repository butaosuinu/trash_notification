import { TRASH_ICONS } from "../../constants/schedule";

type TrashIconProps = {
  icon: string;
};

export function TrashIcon({ icon }: TrashIconProps) {
  const emoji = TRASH_ICONS[icon] as string | undefined;
  if (emoji === undefined) return null;
  return <span className="text-2xl">{emoji}</span>;
}
