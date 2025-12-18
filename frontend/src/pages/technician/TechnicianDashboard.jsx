import { useEffect, useState } from "react"
import { getTechnicianProfile } from "../../services/technicianService"
import { updateUserProfile } from "../../services/userService"

const TechnicianDashboard = () => {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    category: "",
    experience: "",
    price: "",
    bio: "",
  })
  const [image, setImage] = useState(null)
  const [message, setMessage] = useState("")

  const loadProfile = async () => {
    const data = await getTechnicianProfile()
    setProfile(data)
    setForm({
      category: data.category || "",
      experience: data.experience || "",
      price: data.price || "",
      bio: data.bio || "",
    })
  }

  useEffect(() => {
    loadProfile()
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
    setMessage("Profile updated")
    loadProfile()
  }

  if (!profile) return <p className="p-4">Loading...</p>

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Technician Dashboard</h1>
        <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
          {profile.technicianStatus}
        </span>
      </div>

      <div className="border p-4 rounded space-y-2 bg-white">
        <p><b>Name:</b> {profile.name}</p>
        <p><b>Category:</b> {profile.category}</p>
        <p><b>Experience:</b> {profile.experience}</p>
        <p><b>Price:</b> ₹{profile.price}</p>
        <p><b>Rating:</b> ⭐ {profile.averageRating}</p>
        <p><b>Total Reviews:</b> {profile.totalReviews}</p>
      </div>

      <form
        onSubmit={handleUpdate}
        className="border rounded p-4 bg-white space-y-3"
      >
        <h2 className="font-semibold text-lg">Edit Profile</h2>
        <input
          className="border p-2 w-full rounded"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="Experience"
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
        />
        <input
          type="number"
          className="border p-2 w-full rounded"
          placeholder="Service price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <textarea
          className="border p-2 w-full rounded"
          placeholder="Bio"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0])}
        />
        <button className="bg-black text-white px-4 py-2 rounded">
          Save Changes
        </button>
        {message && <p className="text-green-600 text-sm">{message}</p>}
      </form>
    </div>
  )
}

export default TechnicianDashboard
