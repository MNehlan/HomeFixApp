import { useEffect, useState } from "react"
import { getTechnicianProfile, toggleAvailability } from "../../services/technicianService"
import { updateUserProfile } from "../../services/userService"
import ReviewList from "../../components/reviews/ReviewList"
import { useAuth } from "../../context/AuthContextDefinition"
import { useNavigate } from "react-router-dom"

const TechnicianDashboard = () => {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    category: "",
    experience: "",
    price: "",
    mobile: "",
    bio: "",
  })
  const [image, setImage] = useState(null)
  const [message, setMessage] = useState("")
  const [isAvailable, setIsAvailable] = useState(true)

  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }



  useEffect(() => {
    const fetchInitialProfile = async () => {
      try {
        const data = await getTechnicianProfile()
        setProfile(data)
        setForm({
          category: data.category || "",
          experience: data.experience || "",
          price: data.price || "",
          mobile: data.mobile || "",
          bio: data.bio || "",
        })
        setIsAvailable(data.isAvailable !== false)


      } catch (err) {
        console.error("Failed to load technician profile", err)
      }
    }
    fetchInitialProfile()
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("category", form.category)
    formData.append("experience", form.experience)
    formData.append("price", form.price)
    formData.append("mobile", form.mobile)
    formData.append("bio", form.bio)
    if (image) formData.append("image", image)

    await updateUserProfile(formData)
    setMessage("Profile updated successfully")
    setEditing(false)
    // usage of updated profile data
    const updatedData = await getTechnicianProfile()
    setProfile(updatedData)
    setForm({
      category: updatedData.category || "",
      experience: updatedData.experience || "",
      price: updatedData.price || "",
      mobile: updatedData.mobile || "",
      bio: updatedData.bio || "",
    })
    setTimeout(() => setMessage(""), 3000)
  }

  if (!profile) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          Logout
        </button>
      </div>

      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        {/* Profile Card */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 w-full lg:w-1/3 flex flex-col items-center text-center">
          <div className="w-full flex justify-end mb-4">
            <label className="flex items-center cursor-pointer gap-2">
              <span className={`text-[10px] font-bold tracking-widest ${isAvailable ? "text-emerald-600" : "text-slate-400"}`}>
                {isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isAvailable}
                  onChange={async () => {
                    const newState = !isAvailable
                    setIsAvailable(newState)
                    await toggleAvailability(newState)
                  }}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${isAvailable ? "bg-emerald-500" : "bg-slate-300"}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isAvailable ? "translate-x-4" : ""}`}></div>
              </div>
            </label>
          </div>
          <div className="w-28 h-28 rounded-full bg-slate-100 mb-6 overflow-hidden relative border-4 border-slate-50 shadow-inner">
            {profile.profilePic ? (
              <img src={profile.profilePic} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-slate-400">
                {profile.name?.[0]}
              </div>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{profile.name}</h1>
          <p className="text-emerald-600 font-bold mt-1 uppercase text-xs tracking-wider">{profile.category} • {profile.experience} Exp</p>

          <div className="mt-8 flex flex-col sm:flex-row lg:flex-col gap-3 w-full">
            <button
              onClick={() => navigate("/chat")}
              className="flex-1 py-3 rounded-xl bg-black text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-black/20"
            >
              Messages
            </button>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setEditing(true)}
                className="flex-1 py-3 rounded-xl border-2 border-slate-100 text-sm font-bold hover:bg-slate-50 transition-all"
              >
                Edit Profile
              </button>
              <button
                onClick={() => navigate("/technician/jobs")}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl flex flex-col justify-between min-h-[120px]">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Rating</p>
            <div className="text-3xl font-bold mt-auto">★ {profile.averageRating || "New"}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[120px]">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Reviews</p>
            <div className="text-3xl font-bold text-slate-900 mt-auto">{profile.totalReviews || 0}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[120px]">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Rate / hr</p>
            <div className="text-3xl font-bold text-slate-900 mt-auto">₹{profile.price}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[120px]">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Status</p>
            <div className={`text-sm font-bold mt-auto uppercase tracking-wide border px-2 py-1 rounded-lg inline-block w-fit ${profile.technicianStatus === 'APPROVED' ? 'text-emerald-600 border-emerald-100 bg-emerald-50' :
                profile.technicianStatus === 'REJECTED' ? 'text-red-600 border-red-100 bg-red-50' :
                  'text-orange-500 border-orange-100 bg-orange-50'
              }`}>
              {profile.technicianStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Reviews */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span>💬</span> Customer Reviews
            </h2>
            <ReviewList technicianId={profile.uid || profile.id} />
          </div>
        </div>

        {/* Right: Bio / Details */}
        <div className="order-1 lg:order-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>📝</span> About Me
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
              {profile.bio || "No bio added yet."}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {
        editing && (
          <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 z-[100] animate-in fade-in duration-200 backdrop-blur-sm">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl p-6 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Edit Profile</h3>
                <button onClick={() => setEditing(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-black transition-colors">✕</button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-widest">Category</label>
                  <input
                    className="w-full border-2 border-slate-100 p-3 rounded-xl bg-slate-50 focus:border-black transition-colors outline-none font-medium"
                    placeholder="e.g. Electrician, Plumber"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-widest">Experience</label>
                    <input
                      className="w-full border-2 border-slate-100 p-3 rounded-xl bg-slate-50 focus:border-black transition-colors outline-none font-medium"
                      placeholder="e.g. 5 Years"
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-widest">Rate (₹/hr)</label>
                    <input
                      type="number"
                      className="w-full border-2 border-slate-100 p-3 rounded-xl bg-slate-50 focus:border-black transition-colors outline-none font-medium"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-widest">Mobile Number</label>
                  <input
                    className="w-full border-2 border-slate-100 p-3 rounded-xl bg-slate-50 focus:border-black transition-colors outline-none font-medium"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-widest">Bio</label>
                  <textarea
                    className="w-full border-2 border-slate-100 p-3 rounded-xl bg-slate-50 focus:border-black transition-colors outline-none font-medium min-h-[120px]"
                    placeholder="Tell customers about your skills and reliability..."
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-widest">Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:opacity-90 cursor-pointer"
                    onChange={(e) => setImage(e.target.files?.[0])}
                  />
                </div>

                <button className="w-full bg-black text-white py-4 rounded-xl font-bold mt-4 shadow-xl shadow-black/20 hover:scale-[1.01] transition-transform active:scale-100">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )
      }

      {
        message && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-6 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 font-bold text-sm z-[110]">
            {message}
          </div>
        )
      }
    </div>
  )
}

export default TechnicianDashboard
