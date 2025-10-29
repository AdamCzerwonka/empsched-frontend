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
