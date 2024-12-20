import { Todo, FilterOption, SortOption, Priority } from "../../types";

export const priorities: {
  value: Priority;
  label: string;
  color: string;
  bgColor: string;
}[] = [
  {
    value: "low",
    label: "Low",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    value: "medium",
    label: "Medium",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    value: "high",
    label: "High",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
];

export const filterTodos = (todos: Todo[], filter: FilterOption): Todo[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return todos.filter((todo) => {
    switch (filter) {
      case "all":
        return true;
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
      case "high":
      case "medium":
      case "low":
        return todo.priority === filter;
      case "overdue":
        return todo.due_date && new Date(todo.due_date) < today;
      case "due-today": {
        if (!todo.due_date) return false;
        const dueDate = new Date(todo.due_date);
        return dueDate.toDateString() === today.toDateString();
      }
      case "upcoming":
        return todo.due_date && new Date(todo.due_date) > today;
      case "no-date":
        return !todo.due_date;
      default:
        return true;
    }
  });
};

export const sortTodos = (todos: Todo[], sort: SortOption): Todo[] => {
  return [...todos].sort((a, b) => {
    switch (sort) {
      case "newest":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "priority": {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "due-date":
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      default:
        return 0;
    }
  });
};
