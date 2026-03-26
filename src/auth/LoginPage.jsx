import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Mail, Lock, AlertCircle, LayoutDashboard } from "lucide-react";
import { cn } from "../lib/utils";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token);
      navigate("/");
    } catch (e) {
      setErr("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-8">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center gap-2 text-center group">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-indigo-200 shadow-lg group-hover:scale-110 transition-transform">
            <LayoutDashboard className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-2 uppercase">Inventory</h1>
          <p className="text-sm text-slate-500">Sign in to manage your household</p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2" htmlFor="email">
                <Mail className="h-4 w-4 text-slate-400" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2" htmlFor="password">
                  <Lock className="h-4 w-4 text-slate-400" />
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {err && (
              <div className="flex items-center gap-2 p-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-11 rounded-lg bg-indigo-600 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all",
                "hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}