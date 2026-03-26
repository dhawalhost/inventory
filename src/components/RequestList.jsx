import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { CheckCircle2, Clock, Trash2, ShoppingBasket } from "lucide-react";
import { cn } from "../lib/utils";

export default function RequestList({ refresh }) {
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    api.get("/requests").then(res => {
      setRequests(res.data);
    });
  };

  useEffect(fetchRequests, [refresh]);

  const markOrdered = (id) => {
    api.put(`/requests/${id}/order`).then(() => fetchRequests());
  };

  const deleteRequest = (id) => {
    api.delete(`/requests/${id}`).then(() => fetchRequests());
  };

  return (
    <div className="mt-4 flow-root">
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <ShoppingBasket className="h-10 w-10 mb-2 opacity-20" />
          <p className="text-sm italic">Request list is empty.</p>
        </div>
      ) : (
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:pl-0">Item</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Qty</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-0">{req.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{req.quantity} {req.unit}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      {req.is_ordered ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                          <CheckCircle2 className="h-3 w-3" />
                          Ordered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                          <Clock className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <div className="flex items-center justify-end gap-2">
                        {!req.is_ordered && (
                          <button 
                            onClick={() => markOrdered(req.id)}
                            className="rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors"
                          >
                            Mark Ordered
                          </button>
                        )}
                        <button 
                          onClick={() => deleteRequest(req.id)}
                          className="rounded-md bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}