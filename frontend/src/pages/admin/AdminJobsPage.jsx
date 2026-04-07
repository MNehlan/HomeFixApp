import { useEffect, useState } from "react"
import { getJobs } from "../../services/jobService"
import { Calendar, User, Wrench, ChevronDown, ChevronUp, Clock, Activity, FileText } from "lucide-react"

const AdminJobsPage = () => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedIds, setExpandedIds] = useState(new Set())

    const loadJobs = async () => {
        setLoading(true)
        try {
            const data = await getJobs()
            setJobs(data)
        } catch (err) {
            console.error("Failed to load jobs", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadJobs()
    }, [])

    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedIds)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedIds(newExpanded)
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case "COMPLETED": return "bg-emerald-50 text-emerald-600 border-emerald-100/50"
            case "CANCELLED":
            case "REJECTED": return "bg-red-50 text-red-600 border-red-100/50"
            case "IN_PROGRESS": return "bg-blue-50 text-blue-600 border-blue-100/50"
            case "ACCEPTED": return "bg-sky-50 text-sky-600 border-sky-100/50"
            default: return "bg-slate-50 text-slate-600 border-slate-100/50"
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Activity className="w-8 h-8 animate-pulse mb-4" />
            <p className="font-semibold tracking-wide">Loading job history...</p>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">Job History</h1>
                <p className="text-slate-500 font-medium text-[15px]">View and manage the comprehensive log of platform services.</p>
            </div>

            <div className="space-y-4">
                {jobs.length === 0 ? (
                    <div className="bg-white p-16 rounded-[24px] border border-dashed border-slate-200 text-center text-slate-400 font-medium">
                        No job history found.
                    </div>
                ) : (
                    jobs.map((job) => {
                        const isExpanded = expandedIds.has(job.id);
                        return (
                            <div key={job.id} className={`bg-white rounded-[20px] transition-all duration-300 border ${isExpanded ? 'border-slate-300 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1)]' : 'border-slate-100/80 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-slate-200'} overflow-hidden`}>
                                <div 
                                    className="p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer select-none"
                                    onClick={() => toggleExpand(job.id)}
                                >
                                    {/* Primary Info (Always Visible) */}
                                    <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full md:w-auto flex-1">
                                        <div className="flex items-center gap-4 min-w-[200px]">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 ${isExpanded ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <div className="font-extrabold text-slate-900">{job.date}</div>
                                                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                    <Clock size={10} />
                                                    {job.time}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="hidden md:flex items-center gap-2 min-w-[150px]">
                                            <User size={14} className="text-slate-400" />
                                            <span className="font-medium text-[13px] text-slate-700 truncate">{job.customerName || "Customer"}</span>
                                        </div>

                                        <div className="hidden lg:flex items-center gap-2 min-w-[150px]">
                                            <Wrench size={14} className="text-slate-400" />
                                            <span className="font-medium text-[13px] text-slate-700 truncate">{job.technicianName || "Technician"}</span>
                                        </div>
                                    </div>

                                    {/* Status & Toggle */}
                                    <div className="flex flex-row justify-between w-full md:w-auto items-center gap-5 border-t border-slate-50 pt-3 md:border-t-0 md:pt-0">
                                        <div className="flex items-center md:hidden gap-2">
                                            <span className="font-medium text-[13px] text-slate-700 truncate max-w-[120px]">{job.customerName || "Customer"}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 ml-auto">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(job.status)}`}>
                                                {job.status}
                                            </span>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isExpanded ? 'bg-slate-100 text-slate-900' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}>
                                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 border-t border-slate-100/80' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <div className="p-4 md:p-6 bg-[#F8FAFC]">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
                                                {/* Customer Details */}
                                                <div className="space-y-3 p-5 bg-white rounded-[20px] border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
                                                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                                                        <User size={14} className="text-blue-400" />
                                                        Customer Info
                                                    </div>
                                                    <div>
                                                        <div className="text-[15px] font-extrabold text-slate-900 leading-tight">{job.customerName || "Customer"}</div>
                                                        <div className="text-[11px] font-bold text-slate-400 truncate mt-1 tracking-wider uppercase">{job.customerId || "No ID"}</div>
                                                    </div>
                                                </div>

                                                {/* Technician Details */}
                                                <div className="space-y-3 p-5 bg-white rounded-[20px] border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
                                                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                                                        <Wrench size={14} className="text-emerald-400" />
                                                        Technician Info
                                                    </div>
                                                    <div>
                                                        <div className="text-[15px] font-extrabold text-slate-900 leading-tight">{job.technicianName || "Technician"}</div>
                                                        <div className="text-[11px] font-bold text-slate-400 truncate mt-1 tracking-wider uppercase">{job.technicianId || "No ID"}</div>
                                                    </div>
                                                </div>

                                                {/* Service Description */}
                                                <div className="space-y-3 p-5 bg-white rounded-[20px] border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] md:col-span-2 lg:col-span-1">
                                                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                                                        <FileText size={14} className="text-amber-400" />
                                                        Service Description
                                                    </div>
                                                    <p className="text-[13px] leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">{job.description || "No description provided."}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default AdminJobsPage
