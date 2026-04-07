import { useState } from "react"
import { Check, X, FileText, AlertCircle } from "lucide-react"

const VerifyTechnicianCard = ({ technician, onApprove, onReject }) => {
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  return (
    <div className="bg-white rounded-[20px] border border-slate-100/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] p-6 flex flex-col sm:flex-row justify-between items-start gap-6 hover:shadow-lg hover:border-slate-200 transition-all duration-300">
      <div className="flex-1 w-full relative">
        <div className="flex items-center gap-5 mb-5">
          <div className="w-16 h-16 rounded-[16px] bg-slate-50 overflow-hidden border border-slate-100 shrink-0 shadow-inner flex items-center justify-center">
            {technician.profilePic ? (
              <img
                src={technician.profilePic}
                alt={technician.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-extrabold text-2xl text-slate-300 uppercase">
                {technician.name?.[0]}
              </span>
            )}
          </div>
          <div className="min-w-0 pr-4">
            <h3 className="font-extrabold text-lg text-slate-900 truncate leading-tight tracking-tight mb-1">{technician.name}</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">{technician.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-[11px] font-bold uppercase tracking-widest">
          <div className="bg-slate-50/50 p-3 rounded-[14px] border border-slate-100 flex flex-col gap-1 hover:bg-slate-50 transition-colors">
            <span className="text-slate-400">Category</span>
            <span className="text-slate-900 truncate">{technician.category}</span>
          </div>
          <div className="bg-slate-50/50 p-3 rounded-[14px] border border-slate-100 flex flex-col gap-1 hover:bg-slate-50 transition-colors">
            <span className="text-slate-400">Experience</span>
            <span className="text-slate-900 truncate">{technician.experience}</span>
          </div>
          <div className="bg-slate-50/50 p-3 rounded-[14px] border border-slate-100 flex flex-col gap-1 hover:bg-slate-50 transition-colors col-span-2 lg:col-span-1">
            <span className="text-slate-400">Base Price</span>
            <span className="text-slate-900 truncate">₹{technician.price}</span>
          </div>
        </div>

        {technician.certificateUrl && (
          <div className="mt-4 flex">
            <a
              href={technician.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[12px] font-bold text-blue-600 bg-blue-50/50 px-4 py-2.5 rounded-xl border border-blue-100 hover:bg-blue-100 hover:text-blue-700 transition-all active:scale-95 group"
            >
              <FileText size={16} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
              <span>Verify Document</span>
            </a>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full sm:w-auto sm:min-w-[160px] pt-5 sm:pt-0 border-t sm:border-t-0 border-slate-100/80">
        {!showRejectReason ? (
          <>
            <button
              onClick={() => onApprove(technician.uid)}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-[14px] text-xs font-bold hover:bg-black transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] active:scale-[0.98]"
            >
              <Check size={16} />
              Approve Profile
            </button>

            <button
              onClick={() => setShowRejectReason(true)}
              className="w-full flex items-center justify-center gap-2 bg-white text-red-600 border border-slate-200 px-5 py-3 rounded-[14px] text-xs font-bold hover:bg-red-50 hover:border-red-100 transition-all active:scale-[0.98]"
            >
              <X size={16} />
              Reject App
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-3 w-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="relative">
              <textarea
                className="w-full text-[13px] font-medium p-4 pr-10 border border-red-100 rounded-[14px] resize-none focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-200 transition-all bg-white placeholder:text-slate-300 shadow-sm"
                placeholder="Specific reason for rejection..."
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                autoFocus
              />
              <AlertCircle size={16} className="absolute right-3 top-4 text-red-400" />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onReject(technician.uid, rejectionReason)}
                className="w-full bg-red-600 text-white px-4 py-3 rounded-[12px] text-[12px] font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(220,38,38,0.2)] active:scale-[0.98]"
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => setShowRejectReason(false)}
                className="w-full py-2.5 text-slate-500 text-[11px] font-bold uppercase tracking-widest hover:text-slate-800 transition-colors bg-slate-50 rounded-[12px] hover:bg-slate-100 active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyTechnicianCard
