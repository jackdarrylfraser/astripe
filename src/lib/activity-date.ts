export function formatActivityDate(date: Date): string {
  const month = date.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  const day = date.getUTCDate();
  const year = String(date.getUTCFullYear()).padStart(4, "0");
  return `${month} ${day}, ${year}`;
}
