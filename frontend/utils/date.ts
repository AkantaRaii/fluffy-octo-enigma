// // utils/date.ts
// export function toLocalInputValue(isoString: string) {
//   if (!isoString) return "";
//   const date = new Date(isoString);
//   // slice(0,16) gives "YYYY-MM-DDTHH:MM"
//   return date.toISOString().slice(0, 16);
// }



// utils/date.ts
export function toLocalInputValue(isoString: string) {
  if (!isoString) return "";
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
