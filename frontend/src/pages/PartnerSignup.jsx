import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import { registerTechnician } from "../services/authService"

const PartnerSignup = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    category: "",
    experience: "",
    price: "",
    bio: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      )

      const token = await cred.user.getIdToken()
      localStorage.setItem("token", token)

      await registerTechnician({
        name: form.name,
        category: form.category,
        experience: form.experience,
        price: form.price,
        bio: form.bio,
      })

      navigate("/technician/pending")
    } catch (err) {
      setError(err.message || "Unable to register as technician")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-6 rounded-2xl shadow space-y-4"
      >
        <div className="space-y-1">
          <p className="text-sm font-semibold text-emerald-700">
            Partner With Home Fix
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Technician Registration
          </h1>
          <p className="text-sm text-slate-600">
            Create your technician account. Your profile will be reviewed by the
            admin before you can access the technician dashboard.
          </p>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-3">
          <input
            name="name"
            placeholder="Full Name"
            className="border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category (Electrician, Plumber...)"
            className="border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
          />
          <input
            name="experience"
            placeholder="Experience (e.g., 5 years)"
            className="border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Service Price"
            className="border rounded-lg px-3 py-2"
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="bio"
          placeholder="Tell customers about your expertise (optional)"
          className="border rounded-lg px-3 py-2 w-full"
          rows={3}
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white rounded-lg py-3 font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>

        <p className="text-xs text-slate-500 text-center">
          After submission, you will be redirected to a pending page until admin
          approval.
        </p>
      </form>
    </div>
  )
}

export default PartnerSignup

