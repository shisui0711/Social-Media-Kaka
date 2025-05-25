export function getStartOfWeek() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Lấy ngày trong tuần (0 = Chủ nhật, 1 = Thứ hai, ..., 6 = Thứ bảy)

  if (dayOfWeek === 0) {
    // Nếu là Chủ nhật
    return new Date(now.setDate(now.getDate() - 6)); // Quay lại thứ Hai tuần trước
  }

  return new Date(now.setDate(now.getDate() - (dayOfWeek - 1))); // Quay lại thứ Hai tuần này
}

export function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getFirstDayOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function getFirstDayOfYear() {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1); // Tháng 0 = Tháng 1
}

export function getLastDayOfWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // Lấy ngày trong tuần (0 = Chủ nhật, 1 = Thứ hai, ..., 6 = Thứ bảy)

  // Tính ngày đầu tuần (Chủ nhật)
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - dayOfWeek);

  // Tính ngày cuối tuần (Chủ nhật)
  let lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

  // Nếu hôm nay là Chủ nhật, trả về ngày hôm nay làm ngày cuối tuần
  if (dayOfWeek === 0) {
    lastDayOfWeek = today;
  }

  return lastDayOfWeek;
}

export function getLastDayOfMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // Lưu ý rằng tháng trong JavaScript bắt đầu từ 0 (tháng 1 là 0, tháng 12 là 11)

  // Tạo một đối tượng Date cho ngày đầu tiên của tháng sau, sau đó trừ 1 ngày để lấy ngày cuối cùng của tháng hiện tại
  const lastDayOfMonth = new Date(year, month + 1, 0); // `0` là ngày cuối cùng của tháng trước

  return lastDayOfMonth;
}

export function getWeekOfYear(date: Date) {
  // Tạo một bản sao của ngày và thiết lập ngày là thứ Hai của tuần đó
  const startDate = new Date(date.getFullYear(), 0, 1); // Ngày đầu tiên của năm
  const days = Math.floor(
    (date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
  ); // Tính số ngày từ đầu năm đến ngày hiện tại
  const weekNumber = Math.ceil((days + startDate.getDay() + 1) / 7); // Tính số tuần trong năm (theo quy tắc bắt đầu từ thứ Hai)

  return weekNumber;
}

export function getDifferenceDays(start: Date, end: Date) {
  const differenceInTime = end.getTime() - start.getTime();
  return differenceInTime / (1000 * 3600 * 24);
}

export function getDateRangeBefore(start: Date, end: Date) {
  const firstEndDate = new Date(start);
  firstEndDate.setDate(firstEndDate.getDate() - 1);
  const firstStartDate = new Date(firstEndDate);
  firstEndDate.setDate(firstEndDate.getDate() - getDifferenceDays(start, end));

  return {
    firstStartDate: firstStartDate.toDateString(),
    firstEndDate: firstEndDate.toDateString(),
    secondStartDate: start.toDateString(),
    secondEndDate: end.toDateString(),
  };
}

export function getStringByFilter(filter: string) {
  if (filter === "this_day") return "hôm nay";
  if (filter === "this_week") return "tuần này";
  if (filter === "this_month") return "tháng này";
  if (filter === "this_year") return "năm này";
  return "thời gian qua";
}

export function getStringBeforeByFilter(filter: string) {
  if (filter === "this_day") return "hôm qua";
  if (filter === "this_week") return "tuần trước";
  if (filter === "this_month") return "tháng trước";
  if (filter === "this_year") return "năm trước";
  return "thời gian trước";
}
