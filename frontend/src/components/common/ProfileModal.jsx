import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContextDefinition"
import api from "../../services/api" // Direct usage if service not available

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, refreshUser } = useAuth()
    const [name, setName] = useState("")
    const [bio, setBio] = useState("")
    const [photo, setPhoto] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) {
            setName(user.name || "")
            setBio(user.bio || "")
        }
    }, [user])

    if (!isOpen || !user) return null

    const handleSave = async () => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("bio", bio)
            if (photo) {
                formData.append("image", photo)
            } else if (user.photoUrl) {
                formData.append("photoUrl", user.photoUrl)
            }

            await api.put("/user/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            await refreshUser()
            onClose()
        } catch (error) {
            console.error("Failed to update profile", error)
            alert("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-black">
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

                <div className="space-y-4">
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden mb-2">
                            {photo ? (
                                <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full h-full object-cover" />
                            ) : user.photoUrl ? (
                                <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl font-bold">
                                    {user.name?.[0]}
                                </div>
                            )}
                        </div>
                        <label className="text-sm text-blue-600 cursor-pointer hover:underline">
                            Change Photo
                            <input type="file" className="hidden" accept="image/*" onChange={e => setPhoto(e.target.files[0])} />
                        </label>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase text-slate-500">Name</label>
                        <input
                            className="w-full border rounded p-2 mt-1"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase text-slate-500">Bio</label>
                        <textarea
                            className="w-full border rounded p-2 mt-1"
                            rows={3}
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded font-semibold disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileModal
