export function getDateStatus(isoDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const date = new Date(isoDate);
  date.setHours(0, 0, 0, 0);

  const todayTime = today.getTime();
  const dateTime = date.getTime();

  if (todayTime > dateTime) {
    return "overdue";
  }

  if (todayTime === dateTime) {
    return "today";
  }

  const dayOfWeek = today.getDay(); 
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));
  endOfWeek.setHours(0, 0, 0, 0);

  if (dateTime <= endOfWeek.getTime()) {
    return "thisweek";
  }

  return "scheduled";
}
export function formatToDDMMYYYY(isoDate: string): string {
  const date = new Date(isoDate);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
