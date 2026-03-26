import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { AlertCircle, PackagePlus, Calendar, StickyNote } from "lucide-react";
import { cn } from "../lib/utils";

export default function ItemList({ categoryId }) {
  const [items, setItems] = useState([]);

  const fetchItems = () => {
    api.get("/items").then(res => {
      setItems(res.data.filter(i => !categoryId || i.category_id === categoryId));
    });
  };

  useEffect(fetchItems, [categoryId]);

  const addToRequest = (item) => {
    api.post("/requests", { name: item.name, quantity: 1, unit: item.unit }).then(() => {
      alert(`Added ${item.name} to request list`);
    });
  };

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <PackagePlus className="h-12 w-12 mb-4 opacity-20" />
          <p>No items found in this category.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map(item => (
            <li 
              key={item.id} 
              className={cn(
                "group py-4 px-2 transition-colors hover:bg-slate-50 rounded-lg",
                item.quantity === 0 && "bg-red-50/30 hover:bg-red-50/50"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-semibold text-slate-900",
                      item.quantity === 0 && "text-red-700"
                    )}>
                      {item.name}
                    </span>
                    
                    {item.quantity === 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        <AlertCircle className="h-3 w-3" />
                        Out of Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        In Stock
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-slate-500">
                    {item.quantity} {item.unit}
                  </div>

                  {(item.expiry_date || item.notes) && (
                    <div className="flex flex-wrap gap-4 mt-2">
                      {item.expiry_date && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar className="h-3.5 w-3.5" />
                          Exp: {new Date(item.expiry_date).toLocaleDateString()}
                        </div>
                      )}
                      {item.notes && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 italic">
                          <StickyNote className="h-3.5 w-3.5" />
                          {item.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {item.quantity === 0 && (
                  <button 
                    onClick={() => addToRequest(item)}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <PackagePlus className="h-3.5 w-3.5" />
                    Request
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}