"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";

interface Todo {
  id: string;
  description: string;
  priority: number;
  date: string;
  completed: boolean;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [date, setDate] = useState("");

  const [search, setSearch] = useState("");
  const [completed, setCompleted] = useState<"all" | "true" | "false">("all");
  const [orderBy, setOrderBy] = useState<"date" | "priority">("date");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos", {
        params: {
          search,
          completed: completed === "all" ? undefined : completed,
          orderBy,
          orderDirection,
          page,
          pageSize,
        },
      });
      setTodos(res.data || []);
    } catch (err) {
      console.error(err);
      setTodos([]);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [search, completed, orderBy, orderDirection, page]);

  const openCreateModal = () => {
    setEditingTodo(null);
    setDescription("");
    setPriority(1);
    setDate("");
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingTodo) {
        await api.patch(`/todos/${editingTodo.id}`, {
          description,
          priority,
          date,
        });
      } else {
        await api.post("/todos", { description, priority, date });
      }
      setShowModal(false);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await api.delete(`/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCompleted = async (id: string, completed: boolean) => {
    try {
      await api.patch(`/todos/${id}`, { completed: !completed });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setDescription(todo.description);
    setPriority(todo.priority);
    setDate(todo.date.split("T")[0]);
    setShowModal(true);
  };

  const getPriorityIcon = (priority: number) => {
    if (priority === 3) return "🚩";
    if (priority === 2) return "⚑";
    return "🏳️";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-3xl mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-black">My Todo List</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-black rounded-xl shadow-sm transition"
        >
          + New Todo
        </button>
      </div>

      <div className="w-full max-w-3xl flex flex-wrap gap-3 mb-6 bg-white p-4 shadow rounded-2xl">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 rounded-lg border border-gray-300 bg-white focus:ring-1 focus:ring-gray-400 outline-none text-black"
        />
        <select
          value={completed}
          onChange={(e) => setCompleted(e.target.value as any)}
          className="p-2 rounded-lg border border-gray-300 bg-white text-black"
        >
          <option value="false">Pending Tasks</option>
          <option value="true">Completed Tasks</option>
        </select>
        <select
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value as any)}
          className="p-2 rounded-lg border border-gray-300 bg-white text-black"
        >
          <option value="date">Sort By Date</option>
          <option value="priority">Sort By Priority</option>
        </select>
        <select
          value={orderDirection}
          onChange={(e) => setOrderDirection(e.target.value as any)}
          className="p-2 rounded-lg border border-gray-300 bg-white text-black"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      <div className="w-full max-w-3xl space-y-4">
        {todos.length === 0 && (
          <p className="text-center text-gray-500">No tasks found.</p>
        )}
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between bg-white shadow rounded-2xl px-4 py-3 hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleCompleted(todo.id, todo.completed)}
                className="w-5 h-5 accent-gray-600"
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span
                  className={`text-base ${todo.completed ? "line-through text-gray-400" : "text-black"}`}
                >
                  {todo.description}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(todo.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${todo.priority === 1
                    ? "bg-green-100 text-green-800"
                    : todo.priority === 2
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
              >
                Priority {todo.priority}
              </span>

              {!todo.completed && (
                <button onClick={() => startEdit(todo)} className="hover:text-gray-600">
                  🖊️
                </button>
              )}

              <button onClick={() => deleteTodo(todo.id)} className="hover:text-red-600">
                🗑️
              </button>
            </div>

          </div>
        ))}

      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 space-y-5">
            <h2 className="text-xl font-semibold text-black text-center">
              {editingTodo ? "Edit Todo" : "Create Todo"}
            </h2>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Todo Description</label>
              <input
                type="text"
                placeholder="e.g. Buy groceries"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-1 focus:ring-gray-400 outline-none bg-white text-black"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <label className="text-sm text-gray-600">Due Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-1 focus:ring-gray-400 outline-none bg-white text-black"
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm text-gray-600">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-1 focus:ring-gray-400 outline-none bg-white text-black"
                >
                  <option value={1}>Low</option>
                  <option value={2}>Medium</option>
                  <option value={3}>High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-xl shadow transition"
              >
                {editingTodo ? "Update Task" : "Create Task"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
