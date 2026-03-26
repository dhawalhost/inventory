import React, { useState } from "react";
import api from "../api/axios";
import { PlusCircle, ShoppingBag } from "lucide-react";
import { cn } from "../lib/utils";

export default function AddRequest({ onAdd }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("pcs");

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/requests", { name, quantity: parseInt(quantity), unit }).then(() => {
      setName("");
      setQuantity(1);
      setUnit("pcs");
      onAdd();
    });
  };

  const inputClass = "block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className={labelClass}>Item Name</label>
          <input 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            placeholder="What do you need?" 
            className={inputClass}
            required 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Quantity</label>
            <input 
              type="number" 
              value={quantity} 
              onChange={e=>setQuantity(e.target.value)} 
              className={inputClass}
              required 
            />
          </div>
          <div>
            <label className={labelClass}>Unit</label>
            <input 
              value={unit} 
              onChange={e=>setUnit(e.target.value)} 
              placeholder="pcs, kg..." 
              className={inputClass}
              required 
            />
          </div>
        </div>
      </div>

      <button 
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-200 hover:bg-indigo-50 transition-colors"
      >
        <PlusCircle className="h-4 w-4" />
        Add to List
      </button>
    </form>
  );
}