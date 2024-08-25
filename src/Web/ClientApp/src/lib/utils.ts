import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseStringify(data:any) {
  return JSON.parse(JSON.stringify(data))
}

export function calculateTimeDifference(dateTimeString: string): string {
  const originalDate = new Date(dateTimeString);
  const timezoneOffsetInMinutes = originalDate.getTimezoneOffset();
  originalDate.setMinutes(originalDate.getMinutes() - timezoneOffsetInMinutes);

  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - originalDate.getTime()) / 1000);

  if (secondsAgo < 5) {
    return "Vừa xong";
  }
  if (secondsAgo < 60) {
    return `${secondsAgo} giây trước`;
  }

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} phút trước`;
  }

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} giờ trước`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) {
    return `${daysAgo} ngày trước`;
  }

  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo < 4) {
    return `${weeksAgo} tuần trước`;
  }

  const monthsAgo = (now.getFullYear() - originalDate.getFullYear()) * 12 + now.getMonth() - originalDate.getMonth();
  if (monthsAgo < 12) {
    return `${monthsAgo} tháng trước`;
  }

  const yearsAgo = now.getFullYear() - originalDate.getFullYear();
  return `${yearsAgo} năm trước`;
}




export function formatNumber(n:number):string {
  return Intl.NumberFormat('vi-VN',{
    notation: "compact",
    maximumFractionDigits: 1
  }).format(n)
}

export function convertToUsername(name: string): string {
  // Loại bỏ dấu tiếng Việt
  const noDiacriticsName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Chuyển sang chữ thường
  const lowercaseName = noDiacriticsName.toLowerCase();
  // Thay thế khoảng trắng bằng dấu gạch ngang
  const username = lowercaseName.replace(/\s/g, '-');
  return username;
}