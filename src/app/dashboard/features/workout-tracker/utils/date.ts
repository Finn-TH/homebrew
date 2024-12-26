// Create a new shared date utility file
export function getUserLocalDate() {
  return new Date().toLocaleDateString("en-CA"); // Returns YYYY-MM-DD in local timezone
}

export function getWeekDates() {
  const now = new Date();
  const monday = new Date(now);
  while (monday.getDay() !== 1) {
    monday.setDate(monday.getDate() - 1);
  }

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday.toLocaleDateString("en-CA"),
    end: sunday.toLocaleDateString("en-CA"),
  };
}

export function formatDateKey(date: Date) {
  return date.toLocaleDateString("en-CA");
}
