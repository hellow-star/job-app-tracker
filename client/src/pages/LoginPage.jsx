import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext";

// 优化后的导航栏 - 增加适当留白
function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
          <span className="inline-block h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600" />
          <span className="text-slate-800">Job Tracker</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-slate-700">
          <a href="#features" className="hover:text-slate-900 transition">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition">How it works</a>
          <a href="#faq" className="hover:text-slate-900 transition">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/signup" className="text-sm font-medium text-slate-700 hover:text-slate-900">Sign up</Link>
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold shadow-sm border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Navbar />

      {/* 背景动画 blob */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
      />

      {/* 主内容区 - 增加整体留白 */}
      <main className="mx-auto max-w-7xl px-6 sm:px-8 pt-32 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* 介绍/营销文案 - 优化排版和间距 */}
        <section className="max-w-xl mx-auto lg:mx-0">
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Track every application. <span className="text-indigo-600">Land the offer.</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-slate-600 text-lg leading-relaxed"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Welcome! This website helps you organize and accelerate your job search. Log applications, set follow‑up reminders, save company notes, and visualize your progress with a clean dashboard.
          </motion.p>

          <motion.ul
            id="features"
            className="mt-8 grid gap-4 text-slate-700"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
          >
            {["One-click status updates","Deadline & interview reminders","Kanban board & timeline","Resume & cover letter storage"].map((f) => (
              <motion.li
                key={f}
                className="flex items-center gap-3"
                variants={{ hidden: { y: 8, opacity: 0 }, show: { y: 0, opacity: 1 } }}
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-indigo-200 bg-white text-sm">✓</span>
                <span>{f}</span>
              </motion.li>
            ))}
          </motion.ul>

          <div id="how-it-works" className="mt-10">
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm">
              <span className="font-semibold">New here?</span>
              <Link to="/signup" className="underline underline-offset-4 hover:no-underline text-indigo-600">Create an account</Link>
            </div>
          </div>
        </section>

        {/* 登录卡片 - 重点优化留白和排版 */}
        <section className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key="login-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="absolute inset-0 -z-10 blur-xl rounded-3xl bg-gradient-to-br from-indigo-200 via-white to-blue-200" />
              
              {/* 登录表单 - 增加内边距和元素间距 */}
              <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur rounded-3xl shadow-xl ring-1 ring-slate-200 p-8 sm:p-10">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
                  <p className="mt-2 text-sm text-slate-600">Login to access your dashboard and keep momentum.</p>
                </div>

                {error && (
                  <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* 邮箱输入区域 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* 密码输入区域 */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* 选项区域 */}
                <div className="mb-8 flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" />
                    Remember me
                  </label>
                  <Link to="/forgot" className="text-indigo-600 hover:underline transition-colors">Forgot password?</Link>
                </div>

                {/* 登录按钮 */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-70 transition-all"
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{loading ? "Signing in..." : "Sign in"}</span>
                  <svg className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.button>

                {/* 注册提示 */}
                <p className="mt-6 text-center text-sm text-slate-600">
                  Don’t have an account?
                  <Link to="/signup" className="ml-1 font-medium text-indigo-600 hover:underline transition-colors">Sign up</Link>
                </p>
              </form>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* 页脚 - 增加留白 */}
      <footer id="faq" className="border-t border-slate-200 bg-white/60 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 py-10 grid sm:grid-cols-3 gap-8 text-sm text-slate-600">
          <div>
            <div className="font-semibold text-slate-800">Why use Job Tracker?</div>
            <p className="mt-3">Centralize applications, never miss deadlines, and stay interview‑ready with notes and reminders.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-800">Security</div>
            <p className="mt-3">Your data is encrypted in transit. You control what you store.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-800">Support</div>
            <p className="mt-3">Questions? Reach us via the in‑app chat after you sign in.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
