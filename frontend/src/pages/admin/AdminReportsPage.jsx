import { useEffect, useState } from "react"
import { getReports, resolveReport } from "../../services/adminService"
import toast from "react-hot-toast"
import PromptModal from "../../components/common/PromptModal"

const AdminReportsPage = () => {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [promptConfig, setPromptConfig] = useState({ isOpen: false, id: null, status: null })

    const loadReports = async () => {
        setLoading(true)
        try {
            const data = await getReports()
            setReports(data)
        } catch (err) {
            console.error("Failed to load reports", err)
            toast.error("Failed to load reports")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadReports()
    }, [])

    const handleResolveClick = (id, status) => {
        setPromptConfig({ isOpen: true, id, status })
    }

    const handlePromptSubmit = async (notes) => {
        const { id, status } = promptConfig
        try {
            await resolveReport(id, status, notes)
            toast.success(`Report ${status.toLowerCase()} successfully`)
            setPromptConfig({ isOpen: false, id: null, status: null })
            loadReports()
        } catch (err) {
            console.error(err)
            toast.error("Failed to update report")
        }
    }

    if (loading) return <div className="text-center py-10">Loading reports...</div>

    return (
        <div className="space-y-6">
            <PromptModal
                isOpen={promptConfig.isOpen}
                title="Resolution Notes"
                message="Enter any internal notes regarding this resolution (optional)."
                placeholder="e.g. User has been warned..."
                onSubmit={handlePromptSubmit}
                onCancel={() => setPromptConfig({ isOpen: false, id: null, status: null })}
            />

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">User Reports</h1>
            </div>

            <div className="grid gap-6">
                {reports.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-dashed text-center text-slate-400 font-medium italic">
                        No reports found.
                    </div>
                ) : (
                    reports.map((report) => (
                        <div key={report.id} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center font-bold shrink-0">
                                        !
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-slate-900 truncate">{report.reason}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                            Reported by: <span className="text-slate-600">{report.reporter?.name}</span>
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${report.status === 'OPEN' ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                    {report.status}
                                </span>
                            </div>

                            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                                <div className="font-bold text-[10px] text-slate-400 uppercase tracking-widest mb-2">Issue Details</div>
                                <p className="text-sm text-slate-700 leading-relaxed font-medium">{report.details}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-2">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Reported User: <span className="text-slate-900 underline decoration-slate-200 underline-offset-2">{report.reportedUser?.name}</span>
                                </div>

                                {report.status === 'OPEN' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleResolveClick(report.id, 'RESOLVED')}
                                            className="flex-1 sm:flex-none bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-black transition-colors shadow-lg shadow-black/10"
                                        >
                                            Resolve
                                        </button>
                                        <button
                                            onClick={() => handleResolveClick(report.id, 'DISMISSED')}
                                            className="flex-1 sm:flex-none bg-white text-slate-600 border border-slate-200 px-6 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                )}
                            </div>

                            {report.adminNotes && (
                                <div className="border-t border-slate-50 pt-4 text-xs text-slate-500 bg-slate-50/30 -mx-5 -mb-5 p-5 md:-mx-6 md:-mb-6 rounded-b-2xl">
                                    <span className="font-bold uppercase tracking-widest text-[10px] text-slate-400 mr-2">Admin Notes:</span>
                                    <span className="font-medium">{report.adminNotes}</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default AdminReportsPage
