import React, { useState, useContext } from "react";
import CategoryList from "../components/CategoryList";
import ItemList from "../components/ItemList";
import AddItem from "../components/AddItem";
import RequestList from "../components/RequestList";
import AddRequest from "../components/AddRequest";
import { AuthContext } from "../auth/AuthContext";
import { LogOut, LayoutDashboard, Package, ShoppingCart, ListChecks } from "lucide-react";
import { cn } from "../lib/utils";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [refreshItems, setRefreshItems] = useState(0);
  const [refreshRequests, setRefreshRequests] = useState(0);
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-indigo-600">
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-xl tracking-tight uppercase">Inventory</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </header>

      <main className="mx-auto max-w-[1600px] p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Column: Management */}
          <aside className="lg:col-span-3 space-y-8">
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 font-semibold text-slate-700">
                <Package className="h-5 w-5" />
                <h2>Add Item</h2>
              </div>
              <AddItem onAdd={() => setRefreshItems(v => v + 1)} />
            </section>

            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 font-semibold text-slate-700">
                <ListChecks className="h-5 w-5" />
                <h2>Categories</h2>
              </div>
              <CategoryList onSelect={setSelectedCategory} />
            </section>
          </aside>

          {/* Middle Column: Item List */}
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[600px]">
              <div className="flex items-center gap-2 mb-6 font-semibold text-slate-700">
                <Package className="h-5 w-5 text-indigo-500" />
                <h2 className="text-lg">Inventory Items</h2>
              </div>
              <ItemList key={refreshItems} categoryId={selectedCategory} />
            </section>
          </div>

          {/* Right Column: Requests */}
          <aside className="lg:col-span-4 space-y-8">
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 font-semibold text-slate-700">
                <ShoppingCart className="h-5 w-5 text-indigo-500" />
                <h2>New Request</h2>
              </div>
              <AddRequest onAdd={() => setRefreshRequests(v => v + 1)} />
            </section>

            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 font-semibold text-slate-700 text-lg">
                <ListChecks className="h-5 w-5" />
                <h2>Shopping List</h2>
              </div>
              <RequestList refresh={refreshRequests} />
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}