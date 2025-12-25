import StarRating from "../common/StarRating"

const ReviewList = ({ reviews, stats }) => {
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
                                                    {review.createdAt?.seconds
                                                        ? new Date(review.createdAt.seconds * 1000).toLocaleDateString()
                                                        : "Just now"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                                        {review.comment}
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
