import { DateTime } from "luxon";

export const parseFromIsoToDisplayDate = (dateString: string): string => {
  return DateTime.fromISO(dateString).toLocaleString(DateTime.DATE_MED);
};

export const parseFromIsoToDate = (dateString: string): Date => {
  return DateTime.fromISO(dateString).toJSDate();
};

export const parseToIsoDate = (date: Date): string => {
  const isoDate = DateTime.fromJSDate(date).toISODate();
  if (!isoDate) {
    throw new Error("Failed to convert Date to ISO string.");
  }
  return isoDate;
};

/**
 * Combines a time string (e.g., "08:00") with a date to create LocalDateTime format.
 * If no date is provided, uses a placeholder date (1970-01-01).
 */
export const formatTimeToLocalDateTime = (
  time: string,
  date?: Date | string
): string => {
  const dateStr = date
    ? typeof date === "string"
      ? date
      : parseToIsoDate(date)
    : "1970-01-01";
  return `${dateStr}T${time}:00`;
};

/**
 * Extracts time (HH:mm) from a LocalDateTime string.
 */
export const extractTimeFromLocalDateTime = (dateTime: string): string => {
  const dt = DateTime.fromISO(dateTime);
  return dt.toFormat("HH:mm");
};

/**
 * Extracts date from a LocalDateTime string and formats it for display.
 */
export const extractDateFromLocalDateTime = (dateTime: string): string => {
  const dt = DateTime.fromISO(dateTime);
  return dt.toLocaleString(DateTime.DATE_MED);
};

/**
 * Extracts ISO date (YYYY-MM-DD) from a LocalDateTime string.
 */
export const extractIsoDateFromLocalDateTime = (dateTime: string): string => {
  const dt = DateTime.fromISO(dateTime);
  return dt.toISODate() || "";
};
