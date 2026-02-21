export { DAY_NAMES, TRASH_ICONS } from "../../../shared/constants/schedule";

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

export const SATURDAY_INDEX = 6;
export const STAGGER_MS = 50;
