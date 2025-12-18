import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

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
      className="w-full max-w-sm bg-white p-6 rounded-2xl shadow space-y-4"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">
          Enter your email and password to continue.
        </p>
      </div>

      {authError && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
          {authError}
        </p>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        disabled={loading}
        className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60"
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
