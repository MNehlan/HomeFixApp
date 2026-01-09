import { useState, useEffect } from "react"
import { getTechnicianReviews, deleteReview } from "../../services/technicianService"
import StarRating from "../common/StarRating"
import { useAuth } from "../../context/AuthContextDefinition"

const ReviewList = ({ technicianId, onEdit, onRefresh }) => {
    const [reviews, setReviews] = useState([])
    const [stats, setStats] = useState({
        totalReviews: 0,
        averageRating: 0,
        ratingCounts: {}
    })
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        const fetchReviews = async () => {
            if (!technicianId) return
            try {
                setLoading(true)
                const data = await getTechnicianReviews(technicianId)
                setReviews(data.reviews)
                setStats(data.stats)
            } catch (error) {
                console.error("Failed to load reviews", error)
            } finally {
                setLoading(false)
            }
        }
        fetchReviews()
    }, [technicianId, onRefresh]) // Re-fetch when onRefresh changes

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return
        try {
            await deleteReview(reviewId)
            // Refresh reviews locally or trigger parent refresh
            // We can just trigger the effect by toggling a refreshing state or calling parent
            // But since we have onRefresh prop which might be a toggle from parent, 
            // let's just re-fetch here if we can't trigger parent easily.
            // Actually, simpler to just re-fetch:
            const data = await getTechnicianReviews(technicianId)
            setReviews(data.reviews)
            setStats(data.stats)
        } catch (error) {
            console.error("Failed to delete review", error)
            alert("Failed to delete review")
        }
    }

    if (loading) {
        return <div className="text-center py-8">Loading reviews...</div>
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg">
                No reviews yet. Be the first to review!
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-xl min-w-[150px]">
                    <span className="text-5xl font-bold text-slate-900">{stats.averageRating}</span>
                    <div className="my-2">
                        <StarRating rating={Math.round(stats.averageRating)} />
                    </div>
                    <span className="text-sm text-slate-500">{stats.totalReviews} reviews</span>
                </div>

                {/* Rating Bars */}
                <div className="flex-1 w-full space-y-2">
                    {[5, 4, 3, 2, 1].map(stars => {
                        const count = stats.ratingCounts[stars] || 0
                        const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0

                        return (
                            <div key={stars} className="flex items-center gap-3 text-sm">
                                <span className="w-3 font-medium text-slate-600">{stars}</span>
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="w-8 text-right text-slate-400 text-xs">{count}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
                <h3 className="font-bold text-lg text-slate-800">Customer Reviews</h3>
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="border-b pb-6 last:border-0">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                    {review.customerPhotoUrl ? (
                                        <img src={review.customerPhotoUrl} alt={review.customerName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                                            {review.customerName?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{review.customerName}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <StarRating rating={review.rating} size="sm" />
                                                <span className="text-xs text-slate-400">
                                                    {review.createdAt
                                                        ? new Date(review.createdAt).toLocaleDateString()
                                                        : "Just now"}
                                                </span>
                                            </div>
                                        </div>
                                        {user && user.uid === review.customerId && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onEdit(review)}
                                                    className="text-xs font-semibold text-slate-500 hover:text-black px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="text-xs font-semibold text-red-500 hover:text-red-700 px-2 py-1 rounded bg-red-50 hover:bg-red-100"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                                        {review.review}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ReviewList
