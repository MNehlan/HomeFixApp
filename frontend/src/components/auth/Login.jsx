import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth-context"

const Login = () => {
  const { login, authError } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    try {
      const profile = await login(email, password)

      if (!profile) {
        // Handle case where Auth exists but Profile/DB record is missing
        // This can happen if registration failed halfway
        return
      }

      // 🔁 REAL role-based redirect
      if (profile.role === "admin") navigate("/admin")
      else if (
        profile.roles?.includes("technician") &&
        profile.technicianStatus === "APPROVED"
      )
        navigate("/technician")
      else if (profile.roles?.includes("technician"))
        navigate("/technician/pending")
      else navigate("/customer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-5"
    >
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-500">
          Enter your email and password to access your account.
        </p>
      </div>

      {authError && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
          {authError}
        </p>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
          <input
            type="email"
            placeholder="name@example.com"
            className="w-full bg-slate-50 border-slate-200 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-slate-900 placeholder:text-slate-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-slate-50 border-slate-200 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-slate-900 placeholder:text-slate-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-black/20"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-[11px] text-slate-500">
        Admins log in using the admin email and password configured on the
        server.
      </p>
    </form>
  )
}

export default Login
