export const getUserLocalDate = () => {
  return new Date().toLocaleDateString("en-CA");
};

export const getWeekDates = (date: Date = new Date()) => {
  const curr = new Date(date);
  const first = curr.getDate() - curr.getDay();

  const firstDay = new Date(curr);
  firstDay.setDate(first);

  const lastDay = new Date(curr);
  lastDay.setDate(first + 6);

  return {
    start: firstDay.toLocaleDateString("en-CA"),
    end: lastDay.toLocaleDateString("en-CA"),
  };
};
