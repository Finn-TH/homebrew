import { Priority } from "../types";
import { addTodo } from "../actions";

export default function AddTodoForm() {
  return (
    <form action={addTodo} className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          name="title"
          placeholder="Add a new task..."
          className="flex-1 rounded-lg border border-[#8B4513]/20 bg-white/50 px-4 py-2 text-[#8B4513] placeholder-[#8B4513]/40"
          required
        />
        <select
          name="priority"
          className="rounded-lg border border-[#8B4513]/20 bg-white/50 px-4 py-2 text-[#8B4513]"
          defaultValue="medium"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-[#8B4513] px-4 py-2 text-white hover:bg-[#A0522D]"
        >
          Add
        </button>
      </div>
    </form>
  );
}
