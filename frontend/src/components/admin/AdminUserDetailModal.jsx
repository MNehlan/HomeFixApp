import { useState } from "react"
import { verifyTechnician } from "../../services/adminService"

const AdminUserDetailModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [loading, setLoading] = useState(false)

    if (!isOpen || !user) return null

    const handleVerify = async (status) => {
        setLoading(true)
        try {
            await verifyTechnician(user.uid, status)
            if (onUpdate) onUpdate()
            onClose()
        } catch (error) {
            console.error("Failed to verify technician", error)
            alert("Failed to update status")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-black">
                    ✕
                </button>

                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden shrink-0 border">
                            {user.photoUrl ? (
                                <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl font-bold">
                                    {user.name?.[0]}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                            <p className="text-slate-500">{user.email}</p>
                            <span className={`inline-block px-2 py-0.5 rounded text-xs mt-1 capitalize font-medium
                ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                    user.role === 'technician' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 border-b pb-2">Details</h3>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500 text-xs uppercase">Join Date</p>
                                    <p className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs uppercase">Status</p>
                                    <p className="font-medium">
                                        {user.technicianStatus || "Active"}
                                    </p>
                                </div>
                            </div>

                            {user.role === 'technician' && (
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-slate-500 text-xs uppercase">Category</p>
                                        <p className="font-medium">{user.category || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs uppercase">Experience</p>
                                        <p className="font-medium">{user.experience || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs uppercase">Price</p>
                                        <p className="font-medium">{user.price ? `$${user.price}/hr` : "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs uppercase">City</p>
                                        <p className="font-medium">{user.city || "N/A"}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {user.role === 'technician' && (
                                <>
                                    <h3 className="font-semibold text-slate-900 border-b pb-2">Verification & Bio</h3>

                                    <div>
                                        <p className="text-slate-500 text-xs uppercase mb-1">Bio</p>
                                        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                            {user.bio || "No bio provided."}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-slate-500 text-xs uppercase mb-2">Certificate</p>
                                        {user.certificateUrl ? (
                                            <a href={user.certificateUrl} target="_blank" rel="noopener noreferrer"
                                                className="block w-full bg-blue-50 text-blue-600 text-center py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                                                View Certificate
                                            </a>
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">No certificate uploaded.</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons for Pending Technicians (or even approved ones if we want to revoke) */}
                    {user.role === 'technician' && user.technicianStatus === 'PENDING' && (
                        <div className="mt-8 flex gap-3 border-t pt-4">
                            <button
                                onClick={() => handleVerify("APPROVED")}
                                disabled={loading}
                                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Approve Technician"}
                            </button>
                            <button
                                onClick={() => handleVerify("REJECTED")}
                                disabled={loading}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminUserDetailModal
