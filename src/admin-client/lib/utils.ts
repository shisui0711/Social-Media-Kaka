import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stringToDate(dateTimeString: string): Date{
  const originalDate = new Date(dateTimeString);
  const timezoneOffsetInMinutes = originalDate.getTimezoneOffset();
  originalDate.setMinutes(originalDate.getMinutes() - timezoneOffsetInMinutes);
  return originalDate
}
