import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Plus, Package, Tag, Scale, Calendar, StickyNote, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

export default function AddItem({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    unit: "",
    category_id: "",
    expiry_date: "",
    notes: ""
  });
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/items", {
        ...form,
        quantity: parseInt(form.quantity, 10) || 1,
        expiry_date: form.expiry_date || null,
        category_id: form.category_id || null
      });
      setForm({ name: "", quantity: 1, unit: "", category_id: "", expiry_date: "", notes: "" });
      if (onAdd) onAdd();
    } catch {
      setErr("Error adding item");
    }
  };

  const inputClass = "block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
  const labelClass = "flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className={labelClass}>
            <Package className="h-3 w-3" />
            Item Name
          </label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="e.g. Milk, Apples" 
            className={inputClass}
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Quantity
            </label>
            <input 
              name="quantity" 
              type="number" 
              value={form.quantity} 
              onChange={handleChange} 
              min={1} 
              className={inputClass}
              required 
            />
          </div>
          <div>
            <label className={labelClass}>
              <Scale className="h-3 w-3" />
              Unit
            </label>
            <input 
              name="unit" 
              value={form.unit} 
              onChange={handleChange} 
              placeholder="pcs, kg, etc." 
              className={inputClass}
              required 
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            <Tag className="h-3 w-3" />
            Category
          </label>
          <select 
            name="category_id" 
            value={form.category_id} 
            onChange={handleChange}
            className={cn(inputClass, "bg-white")}
          >
            <option value="">No Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            <Calendar className="h-3 w-3" />
            Expiry Date
          </label>
          <input 
            name="expiry_date" 
            type="date" 
            value={form.expiry_date} 
            onChange={handleChange} 
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            <StickyNote className="h-3 w-3" />
            Notes
          </label>
          <textarea 
            name="notes" 
            value={form.notes} 
            onChange={handleChange} 
            placeholder="Optional notes..." 
            rows={2}
            className={cn(inputClass, "resize-none")}
          />
        </div>
      </div>

      <button 
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add to Inventory
      </button>

      {err && (
        <div className="flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
          <AlertCircle className="h-3.5 w-3.5" />
          {err}
        </div>
      )}
    </form>
  );
}