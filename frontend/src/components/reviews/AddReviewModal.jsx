import { useState, useEffect } from "react"

import { rateTechnician, updateReview } from "../../services/technicianService"
import StarRating from "../common/StarRating"

const AddReviewModal = ({ isOpen, onClose, technicianId, onReviewAdded, reviewToEdit, jobId }) => {

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (isOpen) {
            if (reviewToEdit) {
                setRating(reviewToEdit.rating)
                setComment(reviewToEdit.review)
            } else {
                setRating(0)
                setComment("")
            }
            setError("")
        }
    }, [isOpen, reviewToEdit])

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (rating === 0) {
            setError("Please select a star rating")
            return
        }

        setLoading(true)
        setError("")

        try {
            if (reviewToEdit) {
                await updateReview(reviewToEdit.id, rating, comment)
            } else {
                await rateTechnician(technicianId, rating, comment, jobId)
                // Note: CustomerJobs passes 'jobId' via props? No, slightly complex. 
                // CustomerJobs: <AddReviewModal jobId={selectedJobId} ... />
                // AddReviewModal props: ({ isOpen, onClose, technicianId, onReviewAdded, reviewToEdit, jobId })
            }
            onReviewAdded()
            onClose()
            if (!reviewToEdit) {
                setRating(0)
                setComment("")
            }
        } catch (err) {
            console.error(err)
            const msg = err.response?.data?.message || "Failed to submit review"
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md relative p-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-black"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-1 text-slate-900">
                    {reviewToEdit ? "Edit Review" : "Write a Review"}
                </h2>
                <p className="text-sm text-slate-500 mb-6">Share your experience with this technician.</p>

                {error && (
                    <div className="bg-red-50 text-red-600 px-3 py-2 rounded text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center py-2">
                        <StarRating
                            rating={rating}
                            editable
                            onChange={setRating}
                            size="lg"
                        />
                    </div>

                    <div className="text-center text-sm text-slate-500 mb-4">
                        {rating > 0 ? (
                            <span className="font-medium text-yellow-600">
                                {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good" : rating === 3 ? "Average" : rating === 2 ? "Poor" : "Terrible"}
                            </span>
                        ) : "Select a rating"}
                    </div>

                    <textarea
                        placeholder="Tell us about your experience..."
                        className="w-full border rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-black/5"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? "Posting..." : (reviewToEdit ? "Update Review" : "Post Review")}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddReviewModal
