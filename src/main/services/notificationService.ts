import { Notification, powerMonitor } from "electron";
import {
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  getDay,
  format,
} from "date-fns";
import { ja } from "date-fns/locale";
import { createLogger } from "./logger";
import { loadSchedule } from "./scheduleStore";
import { loadNotificationSettings } from "./notificationStore";
import { getTodayEntries } from "../../shared/utils/scheduleMatch";
import { TRASH_ICONS } from "../../shared/constants/schedule";
import type { ScheduleEntry } from "../../shared/types/schedule";

const log = createLogger("notificationService");

const DAYS_IN_WEEK = 7;
const MONDAY = 1;
const MS_PER_MINUTE = 60_000;

const timerState: {
  weeklyId: ReturnType<typeof setTimeout> | null;
  dayBeforeId: ReturnType<typeof setTimeout> | null;
} = { weeklyId: null, dayBeforeId: null };

const TIME_PATTERN = /^\d{2}:\d{2}$/;

function parseTime(timeStr: string): { hour: number; minute: number } | null {
  if (!TIME_PATTERN.test(timeStr)) {
    log.warn(`Invalid time format: "${timeStr}"`);
    return null;
  }
  const [hourStr, minuteStr] = timeStr.split(":");
  return { hour: Number(hourStr), minute: Number(minuteStr) };
}

function setTimeOnDate(date: Date, hour: number, minute: number): Date {
  return setMilliseconds(setSeconds(setMinutes(setHours(date, hour), minute), 0), 0);
}

export function calcMsUntilNextTime(hour: number, minute: number, now: Date): number {
  const todayTarget = setTimeOnDate(now, hour, minute);
  if (todayTarget.getTime() > now.getTime()) {
    return todayTarget.getTime() - now.getTime();
  }
  const tomorrowTarget = addDays(todayTarget, 1);
  return tomorrowTarget.getTime() - now.getTime();
}

export function calcMsUntilNextWeekday(
  targetDay: number,
  hour: number,
  minute: number,
  now: Date,
): number {
  const currentDay = getDay(now);
  const daysUntil = (targetDay - currentDay + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const targetDate = setTimeOnDate(addDays(now, daysUntil), hour, minute);
  if (targetDate.getTime() > now.getTime()) {
    return targetDate.getTime() - now.getTime();
  }
  return setTimeOnDate(addDays(now, DAYS_IN_WEEK), hour, minute).getTime() - now.getTime();
}

function trashLabel(entry: ScheduleEntry): string {
  const icon = TRASH_ICONS[entry.trash.icon] ?? "";
  return icon === "" ? entry.trash.name : `${icon} ${entry.trash.name}`;
}

export function formatWeeklyBody(entries: ScheduleEntry[], startDate: Date): string {
  return Array.from({ length: DAYS_IN_WEEK })
    .map((_, i) => {
      const date = addDays(startDate, i);
      const dayEntries = getTodayEntries(date, entries);
      if (dayEntries.length === 0) return null;
      const dayName = format(date, "EEEE", { locale: ja });
      const trashNames = dayEntries.map((e) => trashLabel(e)).join("、");
      return `${dayName}: ${trashNames}`;
    })
    .filter((line) => line !== null)
    .join("\n");
}

export function formatDayBeforeBody(entries: ScheduleEntry[]): string {
  return entries.map((e) => trashLabel(e)).join("、");
}

function showNotification(title: string, body: string): void {
  const notification = new Notification({ title, body });
  notification.show();
  log.info(`Notification shown: ${title}`);
}

function scheduleWeeklyNotification(): void {
  if (timerState.weeklyId !== null) {
    clearTimeout(timerState.weeklyId);
    // eslint-disable-next-line functional/immutable-data -- timer state requires mutation
    timerState.weeklyId = null;
  }

  const settings = loadNotificationSettings();
  if (!settings.enabled) {
    log.debug("Weekly notification disabled");
    return;
  }

  const parsed = parseTime(settings.weeklyNotificationTime);
  if (parsed === null) {
    log.warn("Invalid weekly notification time, skipping schedule");
    return;
  }
  const { hour, minute } = parsed;
  const now = new Date();
  const ms = calcMsUntilNextWeekday(MONDAY, hour, minute, now);

  log.debug(`Next weekly notification in ${Math.round(ms / MS_PER_MINUTE)} minutes`);

  // eslint-disable-next-line functional/immutable-data -- timer state requires mutation
  timerState.weeklyId = setTimeout(() => {
    const schedule = loadSchedule();
    const mondayDate = new Date();
    const body = formatWeeklyBody(schedule.entries, mondayDate);
    if (body !== "") {
      showNotification("今週のゴミ出しスケジュール", body);
    }
    scheduleWeeklyNotification();
  }, ms);
}

function scheduleDayBeforeNotification(): void {
  if (timerState.dayBeforeId !== null) {
    clearTimeout(timerState.dayBeforeId);
    // eslint-disable-next-line functional/immutable-data -- timer state requires mutation
    timerState.dayBeforeId = null;
  }

  const settings = loadNotificationSettings();
  if (!settings.enabled) {
    log.debug("Day-before notification disabled");
    return;
  }

  const parsed = parseTime(settings.dayBeforeNotificationTime);
  if (parsed === null) {
    log.warn("Invalid day-before notification time, skipping schedule");
    return;
  }
  const { hour, minute } = parsed;
  const now = new Date();
  const ms = calcMsUntilNextTime(hour, minute, now);

  log.debug(`Next day-before notification in ${Math.round(ms / MS_PER_MINUTE)} minutes`);

  // eslint-disable-next-line functional/immutable-data -- timer state requires mutation
  timerState.dayBeforeId = setTimeout(() => {
    const schedule = loadSchedule();
    const tomorrow = addDays(new Date(), 1);
    const tomorrowEntries = getTodayEntries(tomorrow, schedule.entries);
    if (tomorrowEntries.length > 0) {
      const body = formatDayBeforeBody(tomorrowEntries);
      showNotification("明日のゴミ出し", body);
    }
    scheduleDayBeforeNotification();
  }, ms);
}

export function rescheduleNotifications(): void {
  log.info("Rescheduling notifications");
  scheduleWeeklyNotification();
  scheduleDayBeforeNotification();
}

export function initNotification(): void {
  log.info("Initializing notification service");
  scheduleWeeklyNotification();
  scheduleDayBeforeNotification();

  powerMonitor.on("resume", () => {
    log.info("System resumed, rescheduling notifications");
    rescheduleNotifications();
  });
}
