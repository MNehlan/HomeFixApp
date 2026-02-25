import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
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
            toast.error(err.message)
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
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 min-h-screen bg-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/technician')}
                    className="text-slate-500 hover:text-slate-700 font-bold text-sm flex items-center gap-1"
                >
                    ← Back to Dashboard
                </button>
                <h1 className="text-2xl font-bold text-slate-900">Job Management</h1>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-6 border-b border-slate-200 no-scrollbar">
                {["REQUESTED", "ACTIVE", "HISTORY"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 md:px-6 py-3 font-bold text-xs md:text-sm transition-all border-b-2 whitespace-nowrap uppercase tracking-wider ${filter === tab
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        {tab === "REQUESTED" ? "New Requests" : tab === "ACTIVE" ? "Active Jobs" : "History"}
                        <span className={`ml-2 py-0.5 px-2 rounded-full text-[10px] font-bold ${filter === tab ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
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
                    <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 font-medium">
                        No jobs found in this category.
                    </div>
                ) : (
                    filteredJobs.map(job => (
                        <div key={job.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{job.customerName || "Customer"}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Job ID: #{job.id.slice(0, 8)}</p>
                                </div>
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200`}>
                                    {job.status.replace("_", " ")}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                    <Calendar size={18} className="text-blue-500" />
                                    <span className="font-semibold">{job.date}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                    <Clock size={18} className="text-blue-500" />
                                    <span className="font-semibold">{job.time}</span>
                                </div>
                                <div className="col-span-1 sm:col-span-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Description</span>
                                    <p className="text-slate-700 leading-relaxed font-medium">{job.description}</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-50">
                                {job.status === "REQUESTED" && (
                                    <>
                                        <button
                                            onClick={() => updateStatus(job.id, "REJECTED")}
                                            className="w-full sm:w-auto text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-xl text-sm font-bold transition-all border border-transparent hover:border-red-100 flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={18} /> Reject
                                        </button>
                                        <button
                                            onClick={() => updateStatus(job.id, "ACCEPTED")}
                                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={18} /> Accept Request
                                        </button>
                                    </>
                                )}

                                {job.status === "ACCEPTED" && (
                                    <button
                                        onClick={() => updateStatus(job.id, "IN_PROGRESS")}
                                        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                                    >
                                        <Play size={18} /> Start Job
                                    </button>
                                )}

                                {job.status === "IN_PROGRESS" && (
                                    <button
                                        onClick={() => updateStatus(job.id, "COMPLETED")}
                                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
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
