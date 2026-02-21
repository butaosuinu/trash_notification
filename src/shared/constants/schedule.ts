export const DAY_NAMES = [
  "日曜日",
  "月曜日",
  "火曜日",
  "水曜日",
  "木曜日",
  "金曜日",
  "土曜日",
] as const;

export const TRASH_ICONS: Record<string, string> = {
  burn: "🔥",
  nonburn: "🗑️",
  recycle: "♻️",
  plastic: "🧴",
  bottle: "🍾",
  can: "🥫",
  paper: "📰",
  cloth: "👕",
  oversized: "🛋️",
  hazardous: "⚠️",
  battery: "🔋",
  other: "📦",
};
