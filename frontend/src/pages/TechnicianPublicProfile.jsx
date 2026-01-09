import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import { getTechnicianReviews } from "../services/technicianService"
import ReviewList from "../components/reviews/ReviewList"
import AddReviewModal from "../components/reviews/AddReviewModal"
import StarRating from "../components/common/StarRating"
import { useAuth } from "../context/AuthContextDefinition"
import { initiateChat } from "../services/chatService"
import { useNavigate } from "react-router-dom"

const TechnicianPublicProfile = () => {
    const { technicianId } = useParams()


    const [technician, setTechnician] = useState(null)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [reviewToEdit, setReviewToEdit] = useState(null)
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleChat = async () => {
        if (!user) {
            navigate("/auth")
            return
        }
        try {
            const chatId = await initiateChat(user.uid, technician.uid || technician.id, technicianId)
            navigate(`/chat/${chatId}`)
        } catch (error) {
            console.error("Chat initiation failed", error)
        }
    }

    const loadData = async () => {
        try {
            setLoading(true)

            // Fetch Technician Details
            // Assuming technicians are in 'users' collection
            const techDoc = await getDoc(doc(db, "users", technicianId))

            if (!techDoc.exists()) {
                console.error("Technician not found")
                setLoading(false)
                return
            }

            setTechnician({ id: techDoc.id, ...techDoc.data() })

            // Fetch Reviews & Stats
            const data = await getTechnicianReviews(technicianId)
            setStats(data.stats)
        } catch (err) {
            console.error("Failed to load technician profile", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (technicianId) {
            loadData()
        }
        // eslint-disable-next-line
    }, [technicianId])

    const handleEditReview = (review) => {
        setReviewToEdit(review)
        setShowReviewModal(true)
    }

    const handleCloseModal = () => {
        setShowReviewModal(false)
        setReviewToEdit(null)
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>

    if (!technician) return <div className="p-8 text-center text-red-500">Technician not found.</div>

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-100 overflow-hidden shrink-0 border-4 border-white shadow-lg">
                    {technician.profilePic ? (
                        <img src={technician.profilePic} alt={technician.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">
                            {technician.name?.[0]}
                        </div>
                    )}
                </div>

                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">{technician.name}</h1>
                    <p className="text-emerald-600 font-semibold mb-3">{technician.category} • {technician.experience} exp</p>

                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <div className="flex bg-yellow-50 px-2 py-1 rounded text-yellow-700 font-bold text-sm items-center gap-1">
                            <span className="text-lg">{stats?.averageRating}</span>
                            <span>★</span>
                        </div>
                        <span className="text-slate-500 text-sm">({stats?.totalReviews} reviews)</span>
                    </div>

                    <p className="text-slate-600 leading-relaxed max-w-2xl mb-6">
                        {technician.bio || "No bio provided."}
                    </p>

                    <div className="flex gap-3 justify-center md:justify-start">
                        {technician.isAvailable !== false ? (
                            <button onClick={handleChat} className="bg-black text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90">
                                Chat & Book
                            </button>
                        ) : (
                            <button disabled className="bg-slate-200 text-slate-500 px-6 py-2.5 rounded-xl font-semibold cursor-not-allowed">
                                Currently Unavailable
                            </button>
                        )}

                        {technician.mobile && (
                            <a
                                href={`tel:${technician.mobile}`}
                                className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 flex items-center gap-2"
                            >
                                <span>📞</span> Call Now
                            </a>
                        )}
                        <button
                            onClick={() => {
                                setReviewToEdit(null)
                                setShowReviewModal(true)
                            }}
                            className="border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-50"
                        >
                            Write a Review
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Reviews & Ratings</h2>
                </div>

                {stats && <ReviewList technicianId={technician.id} onEdit={handleEditReview} onRefresh={loadData} />}
            </div>

            <AddReviewModal
                isOpen={showReviewModal}
                onClose={handleCloseModal}
                technicianId={technician.id}
                onReviewAdded={loadData}
                reviewToEdit={reviewToEdit}
            />
        </div>
    )
}

export default TechnicianPublicProfile
