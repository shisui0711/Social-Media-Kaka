import { calculateTimeDifference, cn, convertToUsername, formatNumber, parseStringify } from "@/lib/utils";

function formatDateToString(date: Date): string {
  const offset = date.getTimezoneOffset() / 60; // Múi giờ lệch (UTC offset) bằng giờ
  const offsetSign = offset > 0 ? '-' : '+';
  const offsetHours = Math.floor(Math.abs(offset)).toString().padStart(2, '0');
  const offsetMinutes = (Math.abs(offset) % 1 * 60).toString().padStart(2, '0');

  return date.toISOString().replace('T', ' ').replace('Z', `${offsetSign}${offsetHours}${offsetMinutes}`);
}

describe('cn', () => {
  it('should combine and merge class names correctly', () => {
    const result = cn('text-red-500', 'bg-white', 'text-red-500');
    expect(result).toBe('bg-white text-red-500');
  });
});

describe('parseStringify', () => {
  it('should parse and stringify an object correctly', () => {
    const data = { name: 'John', age: 30 };
    const result = parseStringify(data);
    expect(result).toEqual(data);
  });
});

describe('calculateTimeDifference', () => {
  it('should return "Vừa xong" when time difference is less than 5 seconds', () => {
    const now = new Date();
    const result = calculateTimeDifference(formatDateToString(now));
    expect(result).toBe('Vừa xong');
  });

  it('should return correct string when time difference is in seconds', () => {
    const now = new Date();
    const past = new Date(now.setSeconds(now.getSeconds() - 30)); // 30 giây trước
    const result = calculateTimeDifference(formatDateToString(past));
    expect(result).toBe('30 giây trước');
  });

  it('should return correct string when time difference is in minutes', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 5 * 60 * 1000); // 5 phút trước
    const result = calculateTimeDifference(formatDateToString(past));
    expect(result).toBe('5 phút trước');
  });

  it('should return correct string when time difference is in hours', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 3 * 60 * 60 * 1000); // 3 giờ trước
    const result = calculateTimeDifference(formatDateToString(past))
    expect(result).toBe('3 giờ trước');
  });

  it('should return correct string when time difference is in days', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 ngày trước
    const result = calculateTimeDifference(formatDateToString(past));
    expect(result).toBe('2 ngày trước');
  });

  it('should return correct string when time difference is in weeks', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); // 2 tuần trước
    const result = calculateTimeDifference(formatDateToString(past));
    expect(result).toBe('2 tuần trước');
  });

  it('should return correct string when time difference is in months', () => {
    const now = new Date();
    const past = new Date();
    past.setMonth(past.getMonth() - 3); // 3 tháng trước
    const result = calculateTimeDifference(formatDateToString(past));
    expect(result).toBe('3 tháng trước');
  });

  it('should return correct string when time difference is in years', () => {
    const now = new Date();
    const past = new Date();
    past.setFullYear(past.getFullYear() - 2); // 2 năm trước
    const result = calculateTimeDifference(formatDateToString(past));
    expect(result).toBe('2 năm trước');
  });
});

describe('formatNumber', () => {
  it('should format numbers correctly', () => {
    //result separator is not space character
    expect(formatNumber(1200).replace(/[\s]/g, '')).toBe("1,2N");
    expect(formatNumber(1234567).replace(/[\s]/g, '')).toBe('1,2Tr');
    expect(formatNumber(1234567890).replace(/[\s]/g, '')).toBe('1,2T');
  });
});

describe('convertToUsername', () => {
  it('should convert name to username correctly', () => {
    expect(convertToUsername('Nguyễn Văn A')).toBe('nguyen-van-a');
    expect(convertToUsername('Trần Thị B')).toBe('tran-thi-b');
    expect(convertToUsername('Phạm Công C')).toBe('pham-cong-c');
  });
});