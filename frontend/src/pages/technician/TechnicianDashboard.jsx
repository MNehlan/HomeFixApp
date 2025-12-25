import { useEffect, useState } from "react"
import { getTechnicianProfile } from "../../services/technicianService"
import { updateUserProfile } from "../../services/userService"
import ReviewList from "../../components/reviews/ReviewList"
import { useAuth } from "../../context/auth-context"
import { useNavigate } from "react-router-dom"

const TechnicianDashboard = () => {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    category: "",
    experience: "",
    price: "",
    bio: "",
  })
  const [image, setImage] = useState(null)
  const [message, setMessage] = useState("")
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
          bio: data.bio || "",
        })
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
      bio: updatedData.bio || "",
    })
    setTimeout(() => setMessage(""), 3000)
  }

  if (!profile) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-300 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full md:w-1/3 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 overflow-hidden relative group">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-slate-400">
                {profile.name?.[0]}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{profile.name}</h1>
          <p className="text-emerald-600 font-medium">{profile.category} • {profile.experience}</p>

          <div className="mt-4 flex gap-2 w-full">
            <button
              onClick={() => setEditing(true)}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-black text-white p-5 rounded-2xl shadow-lg">
            <p className="text-slate-400 text-sm font-medium">Rating</p>
            <div className="text-3xl font-bold mt-1">★ {profile.averageRating || "New"}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Review Count</p>
            <div className="text-3xl font-bold text-slate-900 mt-1">{profile.totalReviews || 0}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Hourly Rate</p>
            <div className="text-3xl font-bold text-slate-900 mt-1">₹{profile.price}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Status</p>
            <div className="text-lg font-bold text-emerald-600 mt-2 uppercase tracking-wide">{profile.technicianStatus}</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Reviews */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Customer Reviews</h2>
            <ReviewList technicianId={profile.uid || profile.id} />
          </div>
        </div>

        {/* Right: Bio / Details */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">About Me</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              {profile.bio || "No bio added yet."}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Edit Profile</h3>
              <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-black">✕</button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                <input
                  className="w-full border p-2.5 rounded-xl bg-slate-50"
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Experience</label>
                  <input
                    className="w-full border p-2.5 rounded-xl bg-slate-50"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Hourly Rate</label>
                  <input
                    type="number"
                    className="w-full border p-2.5 rounded-xl bg-slate-50"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Bio</label>
                <textarea
                  className="w-full border p-2.5 rounded-xl bg-slate-50 min-h-[100px]"
                  placeholder="Tell customers about yourself..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-slate-800"
                  onChange={(e) => setImage(e.target.files?.[0])}
                />
              </div>

              <button className="w-full bg-black text-white py-3 rounded-xl font-bold mt-4">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {message && (
        <div className="fixed bottom-6 right-6 bg-emerald-900 text-white px-6 py-3 rounded-xl shadow-lg animate-in slide-in-from-bottom-5">
          {message}
        </div>
      )}
    </div>
  )
}

export default TechnicianDashboard
