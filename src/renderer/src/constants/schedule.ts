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

export const TRASH_ICON_LABELS: Record<string, string> = {
  burn: "燃えるゴミ",
  nonburn: "燃えないゴミ",
  recycle: "資源ゴミ",
  plastic: "プラスチック",
  bottle: "ビン",
  can: "缶",
  paper: "古紙・ダンボール",
  cloth: "古布・衣類",
  oversized: "粗大ゴミ",
  hazardous: "有害ゴミ",
  battery: "乾電池",
  other: "その他",
};

export const RULE_TYPE_LABELS: Record<string, string> = {
  weekly: "毎週",
  biweekly: "隔週",
  nthWeekday: "第N曜日",
  specificDates: "指定日",
};

export const WEEK_NUMBER_LABELS = ["第1", "第2", "第3", "第4", "第5"] as const;

export const CLOCK_INTERVAL_MS = 1000;
export const SAVE_FEEDBACK_DELAY_MS = 2000;
