import { useEffect, useState } from "react"
import { getJobs } from "../../services/jobService"

const AdminJobsPage = () => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)

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

    const getStatusStyle = (status) => {
        switch (status) {
            case "COMPLETED": return "bg-emerald-100 text-emerald-700"
            case "CANCELLED":
            case "REJECTED": return "bg-red-100 text-red-700"
            case "IN_PROGRESS": return "bg-blue-100 text-blue-700"
            case "ACCEPTED": return "bg-sky-100 text-sky-700"
            default: return "bg-slate-100 text-slate-700"
        }
    }

    if (loading) return <div className="text-center py-10">Loading job history...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Global Job History</h1>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Technician</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-semibold text-slate-900">{job.date}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">{job.time}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{job.customerName || "Customer"}</div>
                                        <div className="text-[10px] text-slate-400 font-bold truncate max-w-[150px]">{job.customerId}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{job.technicianName || "Technician"}</div>
                                        <div className="text-[10px] text-slate-400 font-bold truncate max-w-[150px]">{job.technicianId}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-600 line-clamp-1">{job.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${getStatusStyle(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-slate-100">
                    {jobs.map((job) => (
                        <div key={job.id} className="p-4 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-slate-900">{job.date}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{job.time}</div>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${getStatusStyle(job.status)}`}>
                                    {job.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</span>
                                    <div className="text-xs font-bold text-slate-900 truncate">{job.customerName || "Customer"}</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Technician</span>
                                    <div className="text-xs font-bold text-slate-900 truncate">{job.technicianName || "Technician"}</div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-xl">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Service Description</span>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">{job.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {jobs.length === 0 && (
                    <div className="p-10 text-center text-slate-400 italic font-medium">No job history found.</div>
                )}
            </div>
        </div>
    )
}

export default AdminJobsPage
