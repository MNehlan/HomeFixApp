import { useState } from "react"
import { rateTechnician } from "../../services/technicianService"

const TechnicianCard = ({ technician }) => {
  const [rating, setRating] = useState("")
  const [review, setReview] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const submitRating = async () => {
    await rateTechnician(technician.technicianId, rating, review)
    setSubmitted(true)
  }

  return (
    <div className="border p-4 rounded space-y-2 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">{technician.name}</h3>
          <p className="text-sm text-gray-600">{technician.category}</p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm">
          ⭐ {technician.averageRating}
        </span>
      </div>

      <p>Experience: {technician.experience}</p>
      <p className="font-semibold">Price: ₹{technician.price}</p>

      <div className="flex gap-2">
        <a
          href="tel:+10000000000"
          className="px-3 py-1 rounded bg-slate-200 text-sm"
        >
          Call
        </a>
        <a
          href="sms:+10000000000"
          className="px-3 py-1 rounded bg-slate-200 text-sm"
        >
          Text
        </a>
        <button
          onClick={() => setShowDetails((s) => !s)}
          className="px-3 py-1 rounded bg-black text-white text-sm"
        >
          {showDetails ? "Hide Profile" : "View Profile"}
        </button>
      </div>

      {showDetails && (
        <div className="border rounded p-3 text-sm space-y-2">
          <p>Average Rating: {technician.averageRating}</p>
          <p>Total Reviews: {technician.totalReviews}</p>
          {technician.bio && <p>{technician.bio}</p>}
        </div>
      )}

      {!submitted ? (
        <div className="space-y-2">
          <input
            type="number"
            min="1"
            max="5"
            placeholder="Rate (1-5)"
            className="border p-1 w-full"
            onChange={(e) => setRating(e.target.value)}
          />

          <input
            placeholder="Review"
            className="border p-1 w-full"
            onChange={(e) => setReview(e.target.value)}
          />

          <button
            onClick={submitRating}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Submit Rating
          </button>
        </div>
      ) : (
        <p className="text-green-600">Thanks for rating!</p>
      )}
    </div>
  )
}

export default TechnicianCard
