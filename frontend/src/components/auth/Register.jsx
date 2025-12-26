import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase/firebaseConfig"
import { registerUser } from "../../services/authService"
import { useNavigate } from "react-router-dom"
import { getFriendlyErrorMessage } from "../../utils/errorUtils"

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // 1️⃣ Firebase signup
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      )

      // 2️⃣ Get token
      const token = await cred.user.getIdToken()
      localStorage.setItem("token", token)

      // 3️⃣ Create user profile in backend
      await registerUser({
        name: form.name,
        email: form.email,
      })

      // 4️⃣ Go to login so user signs in with created account
      navigate("/auth?mode=login")
      navigate("/auth?mode=login")
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
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
        <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
        <p className="text-sm text-slate-500">
          Sign up to book verified home service technicians.
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
          <input
            placeholder="Your name"
            className="w-full bg-slate-50 border-slate-200 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-slate-900 placeholder:text-slate-400"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full bg-slate-50 border-slate-200 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-slate-900 placeholder:text-slate-400"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              className="w-full bg-slate-50 border-slate-200 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-slate-900 placeholder:text-slate-400"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-black/20"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  )
}

export default Register
