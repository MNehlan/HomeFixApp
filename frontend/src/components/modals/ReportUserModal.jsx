import { useState } from "react"
import { submitReport } from "../../services/reportService"
import toast from "react-hot-toast"

const ReportUserModal = ({ isOpen, onClose, reportedUserId, reportedUserName, jobId = null }) => {
    const [reason, setReason] = useState("")
    const [details, setDetails] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!reason) return

        setLoading(true)
        try {
            await submitReport({
                reportedUserId,
                reason,
                details,
                jobId
            })
            toast.success("Report submitted successfully. Admin will review it.")
            onClose()
        } catch (err) {
            console.error(err)
            toast.error("Failed to submit report. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const reasons = [
        "Inappropriate Behavior",
        "Spam / Fraud",
        "Unprofessional Conduct",
        "No-show / Abandonment",
        "Harassment",
        "Other"
    ]

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border">
                <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="text-red-500">⚠️</span> Report User: <span className="text-black underline">{reportedUserName}</span>
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-black transition-colors font-bold text-xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reason for Report</label>
                        <select
                            required
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        >
                            <option value="">Select a reason...</option>
                            {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Additional Details</label>
                        <textarea
                            placeholder="Please provide more information about the issue..."
                            rows={4}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all resize-none"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading || !reason}
                            className="flex-[2] py-3 text-sm font-bold bg-black text-white rounded-xl hover:opacity-90 disabled:opacity-50 shadow-lg shadow-black/20 transition-all"
                        >
                            {loading ? "Submitting..." : "Submit Report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ReportUserModal
