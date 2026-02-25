import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import AddReviewModal from "../../components/reviews/AddReviewModal"
import api from "../../services/api"
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle } from "lucide-react"
import ConfirmModal from "../../components/common/ConfirmModal"

const CustomerJobs = () => {
    // const { user } = useAuth() 
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, jobId: null })
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    // Rating State
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [selectedJobId, setSelectedJobId] = useState(null)
    const [selectedTechId, setSelectedTechId] = useState(null)

    const fetchJobs = async () => {
        try {
            const response = await api.get("/jobs")
            setJobs(response.data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    const handleCancelClick = (jobId) => {
        setConfirmConfig({ isOpen: true, jobId })
    }

    const handleConfirmCancel = async () => {
        const { jobId } = confirmConfig
        try {
            await api.patch(`/jobs/${jobId}/status`, { status: "CANCELLED" })
            toast.success("Request cancelled successfully")
            setConfirmConfig({ isOpen: false, jobId: null })
            fetchJobs() // Refresh
        } catch (err) {
            toast.error(err.message)
        }
    }

    const handleRate = (job) => {
        setSelectedJobId(job.id)
        setSelectedTechId(job.technicianId)
        setShowRatingModal(true)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "REQUESTED": return "bg-yellow-100 text-yellow-800"
            case "ACCEPTED": return "bg-blue-100 text-blue-800"
            case "IN_PROGRESS": return "bg-purple-100 text-purple-800"
            case "COMPLETED": return "bg-green-100 text-green-800"
            case "CANCELLED": return "bg-red-100 text-red-800"
            case "REJECTED": return "bg-gray-100 text-gray-600"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Loading jobs...</div>

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                title="Cancel Request"
                message="Are you sure you want to cancel this service request? This action cannot be undone."
                onConfirm={handleConfirmCancel}
                onCancel={() => setConfirmConfig({ isOpen: false, jobId: null })}
                confirmText="Yes, Cancel"
                type="danger"
            />
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/customer')}
                    className="text-slate-500 hover:text-slate-700 font-bold text-sm flex items-center gap-1"
                >
                    ← Back to Dashboard
                </button>
                <h1 className="text-2xl font-bold text-slate-900">My Service Requests</h1>
            </div>

            {error && <div className="text-red-500 mb-4 bg-red-50 p-3 rounded-xl border border-red-100 text-sm">{error}</div>}

            {jobs.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed text-slate-400 font-medium">
                    You haven't requested any services yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{job.technicianName || 'Technician'}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Request ID: #{job.id.slice(0, 8)}</p>
                                </div>
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusColor(job.status)}`}>
                                    {job.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl">
                                    <Calendar size={18} className="text-blue-500" />
                                    <span className="font-semibold">{job.date}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl">
                                    <Clock size={18} className="text-blue-500" />
                                    <span className="font-semibold">{job.time}</span>
                                </div>
                                <div className="col-span-1 sm:col-span-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Issue Description</span>
                                    <p className="text-slate-700 leading-relaxed font-medium">{job.description}</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-50">
                                {job.status === "REQUESTED" && (
                                    <button
                                        onClick={() => handleCancelClick(job.id)}
                                        className="w-full sm:w-auto text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-xl text-sm font-bold transition-all border border-transparent hover:border-red-100"
                                    >
                                        Cancel Request
                                    </button>
                                )}

                                {job.status === "COMPLETED" && !job.isRated && (
                                    <button
                                        onClick={() => handleRate(job)}
                                        className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-yellow-500/20"
                                    >
                                        Rate Service
                                    </button>
                                )}

                                {["COMPLETED", "CANCELLED", "REJECTED"].includes(job.status) && (
                                    <a
                                        href={`/technician/profile/${job.technicianId}`}
                                        className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-black/20 text-center"
                                    >
                                        Book Again
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reusing existing AddReviewModal with slight tweak: pass jobId if component supports it? 
               Current AddReviewModal likely takes technicianId. 
               We need to modify AddReviewModal to support Job ID for enforcement.
               For now, we pass technicianId as before. 
               Ideally we should pass jobId too. */}
            <AddReviewModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                technicianId={selectedTechId}
                onReviewAdded={() => {
                    fetchJobs()
                    setShowRatingModal(false)
                }}
                jobId={selectedJobId} // Will need to update AddReviewModal to accept this
            />
        </div>
    )
}

export default CustomerJobs
