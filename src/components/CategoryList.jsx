import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Tag, Plus, AlertCircle, Hash } from "lucide-react";
import { cn } from "../lib/utils";

export default function CategoryList({ onSelect }) {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const fetchCategories = () => {
    api.get("/categories")
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  };

  useEffect(fetchCategories, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/categories", { name });
      setName("");
      fetchCategories();
    } catch {
      setErr("Error adding category");
    }
  };

  const handleSelect = (id) => {
    const newId = selectedId === id ? "" : id;
    setSelectedId(newId);
    if (onSelect) onSelect(newId);
  };

  const inputClass = "block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-2">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Tag className="h-4 w-4 text-slate-400" />
          </div>
          <input 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            placeholder="New category..." 
            className={cn(inputClass, "pl-10")}
            required 
          />
        </div>
        <button 
          type="submit"
          className="flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      {err && (
        <div className="flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
          <AlertCircle className="h-3.5 w-3.5" />
          {err}
        </div>
      )}

      <nav className="space-y-1">
        <button
          onClick={() => handleSelect("")}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            selectedId === "" 
              ? "bg-indigo-50 text-indigo-700" 
              : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
          )}
        >
          <Hash className="h-4 w-4 opacity-50" />
          All Categories
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              selectedId === cat.id 
                ? "bg-indigo-50 text-indigo-700" 
                : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
            )}
          >
            <Tag className="h-4 w-4 opacity-50" />
            {cat.name}
          </button>
        ))}
      </nav>
    </div>
  );
}