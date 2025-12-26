import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import api from "../services/api" // Import api service
import { registerTechnician } from "../services/authService"
import { applyTechnician } from "../services/technicianService" // Add this import
import { useAuth } from "../context/AuthContextDefinition" // Add this import
import { getFriendlyErrorMessage } from "../utils/errorUtils"

const PartnerSignup = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, refreshUser } = useAuth() // Get current user

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    category: "",
    experience: "",
    price: "",
    city: "",
    mobile: "",
    bio: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isCustomCategory, setIsCustomCategory] = useState(false)

  // File states
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [certificate, setCertificate] = useState(null)

  // Pre-fill data if user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }))
    }
  }, [isAuthenticated, user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    if (e.target.name === "profilePhoto") {
      setProfilePhoto(e.target.files[0])
    } else if (e.target.name === "certificate") {
      setCertificate(e.target.files[0])
    }
  }

  const uploadFile = async (file) => {
    if (!file) return null
    const formData = new FormData()
    formData.append("file", file)
    const res = await api.post("/user/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    return res.data.url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isAuthenticated) {
        // Upgrade existing user
        let photoUrl = user?.photoUrl || null
        if (profilePhoto) {
          photoUrl = await uploadFile(profilePhoto)
        }

        let certificateUrl = null
        if (certificate) {
          certificateUrl = await uploadFile(certificate)
        }

        await applyTechnician({
          category: form.category,
          experience: form.experience,
          price: form.price,
          city: form.city,
          bio: form.bio,
          mobile: form.mobile,
          certificateUrl,
          photoUrl
        })
        await refreshUser()
      } else {
        // Register new user
        const cred = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        )


        const token = await cred.user.getIdToken()
        localStorage.setItem("token", token)

        // Upload files - now using backend upload which needs auth
        // We just set the token, so api interceptor should pick it up

        let photoUrl = null
        if (profilePhoto) {
          photoUrl = await uploadFile(profilePhoto)
        }

        let certificateUrl = null
        if (certificate) {
          certificateUrl = await uploadFile(certificate)
        }

        await registerTechnician({
          name: form.name,
          category: form.category,
          experience: form.experience,
          price: form.price,
          city: form.city,
          bio: form.bio,
          mobile: form.mobile,
          photoUrl,
          certificateUrl
        })

        await refreshUser()
      }

      navigate("/technician/pending")
      navigate("/technician/pending")
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
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
        <div className="space-y-2 text-center">
          <Link to="/" className="mx-auto w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-4 transition transform hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {isAuthenticated ? "Upgrade to Technician" : "Technician Registration"}
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            {isAuthenticated
              ? "Turn your customer account into a business profile. Start receiving jobs."
              : "Join our network of verified professionals. Sign up to get access to jobs in your area."}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Full Name"
            className="border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            value={form.name}
            onChange={handleChange}
            required
            disabled={isAuthenticated}
            readOnly={isAuthenticated}
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            value={form.email}
            onChange={handleChange}
            required
            disabled={isAuthenticated}
            readOnly={isAuthenticated}
          />
          {!isAuthenticated && (
            <div className="relative md:col-span-2">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create Password"
                className="w-full border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                onChange={handleChange}
                required
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
          )}

          {/* Category Logic */}
          <div className="space-y-2">
            {!isCustomCategory ? (
              <select
                name="category"
                className="w-full border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-slate-600"
                value={form.category}
                onChange={(e) => {
                  if (e.target.value === "Other") {
                    setIsCustomCategory(true)
                    setForm({ ...form, category: "" })
                  } else {
                    setForm({ ...form, category: e.target.value })
                  }
                }}
                required
              >
                <option value="">Select Category</option>
                {["Electrician", "Plumber", "Carpenter", "Painter", "AC Repair", "Appliance Repair", "House Cleaning"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Other">Other (Specify)</option>
              </select>
            ) : (
              <div className="relative">
                <input
                  name="category"
                  placeholder="Specify Category"
                  className="w-full border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  value={form.category}
                  onChange={handleChange}
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-black"
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>
          <select
            name="experience"
            className="border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-slate-600"
            onChange={handleChange}
            required
            value={form.experience}
          >
            <option value="">Select Experience</option>
            <option value="0-1 years">0-1 years</option>
            <option value="1-3 years">1-3 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5+ years">5+ years</option>
          </select>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
            <input
              name="price"
              type="number"
              placeholder="Hourly Rate"
              className="w-full border-slate-200 rounded-xl pl-9 pr-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
              onChange={handleChange}
              required
            />
          </div>
          <input
            name="city"
            placeholder="City / Location"
            className="border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            onChange={handleChange}
            required
          />
          <input
            name="mobile"
            type="tel"
            placeholder="Mobile Number"
            className="border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            onChange={handleChange}
            required
          />

          <div className="md:col-span-2 space-y-2 pt-2">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Profile Photo</label>
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition-all cursor-pointer"
              onChange={handleFileChange}
              required={!isAuthenticated}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Verification Certificate</label>
            <input
              type="file"
              name="certificate"
              accept=".pdf,image/*"
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition-all cursor-pointer"
              onChange={handleFileChange}
              required
            />
            <p className="text-xs text-slate-400">Upload a government ID or trade certificate for verification.</p>
          </div>
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
          After submission, you will be redirected to a pending page until admin approval.
        </p>
      </form>
    </div>
  )
}

export default PartnerSignup

