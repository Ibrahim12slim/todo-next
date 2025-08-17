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

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos");
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

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
    setDate(todo.date);
    setShowModal(true);
  };

  const groupedTodos = () => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    return {
      Today: todos.filter((t) => t.date?.startsWith(today)),
      Tomorrow: todos.filter((t) => t.date?.startsWith(tomorrow)),
      Others: todos.filter(
        (t) => !t.date?.startsWith(today) && !t.date?.startsWith(tomorrow)
      ),
    };
  };

  const getPriorityIcon = (priority: number) => {
    if (priority === 3) return "🚩";
    if (priority === 2) return "⚑";
    return "🏳️";
  };

  const sections = groupedTodos();

  return (
    <div className="relative min-h-screen bg-gray-50 p-6">
      {Object.entries(sections).map(([label, items]) =>
        items.length > 0 ? (
          <div key={label} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{label}</h2>
            <div className="space-y-3">
              {items.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between bg-white shadow rounded-2xl px-4 py-3 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleCompleted(todo.id, todo.completed)}
                      className="w-5 h-5 accent-blue-500"
                    />
                    <span
                      className={`text-base ${
                        todo.completed ? "line-through text-gray-400" : "text-gray-800"
                      }`}
                    >
                      {todo.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg">{getPriorityIcon(todo.priority)}</span>
                    <button
                      onClick={() => startEdit(todo)}
                      className="hover:text-blue-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="hover:text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}

      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-3xl shadow-xl w-[380px] p-6 space-y-5 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        {editingTodo ? "Edit Task" : "Create Task"}
      </h2>

      <div className="space-y-2">
        <label className="text-sm text-gray-600">Task Description</label>
        <input
          type="text"
          placeholder="e.g. Buy groceries"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <label className="text-sm text-gray-600">Due Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-sm text-gray-600">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
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
          className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-md transition"
        >
          {editingTodo ? "Update Task" : "Create Task"}
        </button>
        <button
          onClick={() => setShowModal(false)}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      <div className="fixed bottom-6 right-6 flex gap-4">
        <button
          onClick={fetchTodos}
          className="w-12 h-12 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full shadow text-xl"
        >
          ⟳
        </button>
        <button
          onClick={openCreateModal}
          className="w-12 h-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow text-2xl"
        >
          +
        </button>
      </div>
    </div>
  );
}
