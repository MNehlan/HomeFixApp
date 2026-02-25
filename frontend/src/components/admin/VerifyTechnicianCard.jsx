import { useState } from "react"

const VerifyTechnicianCard = ({ technician, onApprove, onReject }) => {
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row justify-between items-start gap-6 hover:shadow-md transition-shadow">
      <div className="flex-1 w-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
            {technician.profilePic ? (
              <img
                src={technician.profilePic}
                alt={technician.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-slate-400">
                {technician.name?.[0]}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-slate-900 truncate">{technician.name}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">{technician.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-[11px] font-bold uppercase tracking-widest">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
            <span className="text-slate-400 block mb-1">Category</span>
            <span className="text-slate-900">{technician.category}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
            <span className="text-slate-400 block mb-1">Experience</span>
            <span className="text-slate-900">{technician.experience}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
            <span className="text-slate-400 block mb-1">Base Price</span>
            <span className="text-slate-900">₹{technician.price}</span>
          </div>
          {technician.certificateUrl && (
            <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50 flex flex-col justify-center">
              <a
                href={technician.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline decoration-blue-200 underline-offset-2"
              >
                View Document
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full sm:w-auto sm:min-w-[140px] pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
        {!showRejectReason ? (
          <>
            <button
              onClick={() => onApprove(technician.uid)}
              className="w-full bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg shadow-black/10 active:scale-95"
            >
              Approve
            </button>

            <button
              onClick={() => setShowRejectReason(true)}
              className="w-full bg-white text-red-600 border border-red-100 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-red-50 transition-all active:scale-95"
            >
              Reject
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            <textarea
              className="w-full text-xs font-medium p-3 border border-red-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500/10 transition-all bg-red-50/30"
              placeholder="Reason for rejection..."
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowRejectReason(false)}
                className="flex-1 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onReject(technician.uid, rejectionReason)}
                className="flex-[2] bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
                disabled={!rejectionReason.trim()}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyTechnicianCard
