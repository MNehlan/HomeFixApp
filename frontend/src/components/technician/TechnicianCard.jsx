import { useNavigate } from "react-router-dom"
import StarRating from "../common/StarRating"

const TechnicianCard = ({ technician }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0">
            {technician.photoUrl ? (
              <img src={technician.photoUrl} alt={technician.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-lg">
                {technician.name?.[0]}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{technician.name}</h3>
            <p className="text-sm text-emerald-600 font-medium">{technician.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
          <span className="font-bold text-yellow-700 text-sm">{technician.averageRating || "New"}</span>
          <span className="text-yellow-500 text-xs">★</span>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Experience</span>
          <span className="font-medium text-slate-900">{technician.experience}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Rate</span>
          <span className="font-medium text-slate-900">₹{technician.price}/hr</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Reviews</span>
          <span className="font-medium text-slate-900">{technician.totalReviews || 0}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
        <button
          onClick={() => navigate(`/technician/profile/${technician.technicianId || technician.id}`)}
          className="flex-1 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-black transition-colors"
        >
          View Profile & Book
        </button>
      </div>
    </div>
  )
}

export default TechnicianCard
