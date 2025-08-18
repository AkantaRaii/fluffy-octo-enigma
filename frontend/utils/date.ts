// utils/date.ts
export function toLocalInputValue(isoString: string) {
  if (!isoString) return "";
  const date = new Date(isoString);
  // slice(0,16) gives "YYYY-MM-DDTHH:MM"
  return date.toISOString().slice(0, 16);
}
