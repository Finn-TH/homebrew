export const formatDateKey = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const getWeekStart = (): Date => {
  const today = new Date();
  const monday = new Date(today);
  while (monday.getDay() !== 1) {
    monday.setDate(monday.getDate() - 1);
  }
  return monday;
};
