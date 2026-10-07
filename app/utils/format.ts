const SUPERSCRIPT_DIGITS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

export function superscript(value: string | number) {
  return String(value).replace(
    /\d/g,
    (digit) => SUPERSCRIPT_DIGITS[Number(digit)],
  );
}

// Frontmatter dates are parsed as UTC midnight, so formatting in local time can shift them a day back
export function formatDate(date: string | Date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function displayUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCount(value: number) {
  return compactNumber.format(value).toLowerCase();
}

export function formatPlaytime(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const hours = minutes / 60;
  return hours < 100
    ? `${hours.toFixed(1)}h`
    : `${Math.round(hours).toLocaleString("en")}h`;
}
