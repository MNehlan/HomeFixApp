import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase/firebaseConfig"
import { registerUser } from "../../services/authService"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })
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
    } catch (err) {
      setError(err.message || "Signup failed")
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
          <input
            type="password"
            placeholder="At least 6 characters"
            className="w-full bg-slate-50 border-slate-200 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-slate-900 placeholder:text-slate-400"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
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
