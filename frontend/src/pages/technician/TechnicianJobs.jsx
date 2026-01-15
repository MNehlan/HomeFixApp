import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Play, Check } from "lucide-react"
import api from "../../services/api"

const TechnicianJobs = () => {
    // const { user } = useAuth()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("REQUESTED") // REQUESTED, ACTIVE, HISTORY
    const navigate = useNavigate()

    const fetchJobs = async () => {
        try {
            const response = await api.get("/jobs")
            setJobs(response.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    const updateStatus = async (jobId, newStatus) => {
        try {
            await api.patch(`/jobs/${jobId}/status`, { status: newStatus })
            fetchJobs() // Refresh list
        } catch (err) {
            alert(err.message)
        }
    }

    const filteredJobs = jobs.filter(job => {
        if (filter === "REQUESTED") return job.status === "REQUESTED"
        if (filter === "ACTIVE") return ["ACCEPTED", "IN_PROGRESS"].includes(job.status)
        if (filter === "HISTORY") return ["COMPLETED", "CANCELLED", "REJECTED"].includes(job.status)
        return false
    })

    if (loading) return <div className="p-8 text-center text-slate-500">Loading jobs...</div>

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/technician')}
                    className="text-slate-500 hover:text-slate-700 font-medium"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-slate-900">Job Management</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200">
                {["REQUESTED", "ACTIVE", "HISTORY"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${filter === tab
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        {tab === "REQUESTED" ? "New Requests" : tab === "ACTIVE" ? "Active Jobs" : "History"}
                        <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">
                            {jobs.filter(j => {
                                if (tab === "REQUESTED") return j.status === "REQUESTED"
                                if (tab === "ACTIVE") return ["ACCEPTED", "IN_PROGRESS"].includes(j.status)
                                if (tab === "HISTORY") return ["COMPLETED", "CANCELLED", "REJECTED"].includes(j.status)
                                return false
                            }).length}
                        </span>
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed">
                        No jobs found in this category.
                    </div>
                ) : (
                    filteredJobs.map(job => (
                        <div key={job.id} className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{job.customerName || "Customer"}</h3>
                                    <p className="text-sm text-slate-500">#{job.id.slice(0, 6)}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700`}>
                                    {job.status.replace("_", " ")}
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
                                    <span className="font-semibold block mb-1 text-slate-700">Description:</span>
                                    {job.description}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                {job.status === "REQUESTED" && (
                                    <>
                                        <button
                                            onClick={() => updateStatus(job.id, "REJECTED")}
                                            className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                                        >
                                            <XCircle size={18} /> Reject
                                        </button>
                                        <button
                                            onClick={() => updateStatus(job.id, "ACCEPTED")}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                                        >
                                            <CheckCircle size={18} /> Accept Request
                                        </button>
                                    </>
                                )}

                                {job.status === "ACCEPTED" && (
                                    <button
                                        onClick={() => updateStatus(job.id, "IN_PROGRESS")}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                                    >
                                        <Play size={18} /> Start Job
                                    </button>
                                )}

                                {job.status === "IN_PROGRESS" && (
                                    <button
                                        onClick={() => updateStatus(job.id, "COMPLETED")}
                                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                                    >
                                        <Check size={18} /> Complete Job
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default TechnicianJobs
