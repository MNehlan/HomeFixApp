import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp
} from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

const REVIEWS_COLLECTION = "reviews"

export const addReview = async (reviewData) => {
    try {
        const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
            ...reviewData,
            createdAt: serverTimestamp()
        })
        return docRef.id
    } catch (error) {
        console.error("Error adding review:", error)
        throw error
    }
}

export const getTechnicianReviews = async (technicianId) => {
    try {
        const q = query(
            collection(db, REVIEWS_COLLECTION),
            where("technicianId", "==", technicianId),
            orderBy("createdAt", "desc")
        )

        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    } catch (error) {
        console.error("Error fetching reviews:", error)
        return []
    }
}

export const getTechnicianStats = async (technicianId) => {
    const reviews = await getTechnicianReviews(technicianId)

    if (reviews.length === 0) {
        return {
            averageRating: 0,
            totalReviews: 0,
            ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        }
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    reviews.forEach(review => {
        if (ratingCounts[review.rating] !== undefined) {
            ratingCounts[review.rating]++
        }
    })

    return {
        averageRating: (totalRating / reviews.length).toFixed(1),
        totalReviews: reviews.length,
        ratingCounts
    }
}
