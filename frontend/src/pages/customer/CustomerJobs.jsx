import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AddReviewModal from "../../components/reviews/AddReviewModal"
import api from "../../services/api"
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle } from "lucide-react"

const CustomerJobs = () => {
    // const { user } = useAuth() 
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
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

    const handleCancel = async (jobId) => {
        if (!window.confirm("Are you sure you want to cancel this request?")) return;

        try {
            await api.patch(`/jobs/${jobId}/status`, { status: "CANCELLED" })
            fetchJobs() // Refresh
        } catch (err) {
            alert(err.message)
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
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/customer')}
                    className="text-slate-500 hover:text-slate-700 font-medium"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-slate-900">My Service Requests</h1>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {jobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-500">
                    You haven't requested any services yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job.id} className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{job.technicianName || 'Technician'}</h3>
                                    <p className="text-sm text-slate-500">Request ID: #{job.id.slice(0, 6)}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(job.status)}`}>
                                    {job.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-blue-500" />
                                    <span>{job.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-blue-500" />
                                    <span>{job.time}</span>
                                </div>
                                <div className="col-span-1 md:col-span-2 bg-slate-50 p-3 rounded-lg">
                                    <span className="font-semibold block mb-1 text-slate-700">Issue Description:</span>
                                    {job.description}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                {job.status === "REQUESTED" && (
                                    <button
                                        onClick={() => handleCancel(job.id)}
                                        className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        Cancel Request
                                    </button>
                                )}

                                {job.status === "COMPLETED" && (
                                    // Note: Checking for existing rating logic should ideally happen, 
                                    // but for now the user can click Rate. 
                                    // Backend will prevent duplicate. 
                                    // Frontend improvement: check if rated.
                                    <button
                                        onClick={() => handleRate(job)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                                    >
                                        Rate Service
                                    </button>
                                )}

                                {["COMPLETED", "CANCELLED", "REJECTED"].includes(job.status) && (
                                    <a
                                        href={`/technician/${job.technicianId}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
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
