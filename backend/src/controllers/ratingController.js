import { db } from "../config/firebase.js"

export const addRating = async (req, res) => {
  try {
    const { technicianId, rating, review } = req.body
    const customerId = req.user.uid

    const numericRating = Number(rating)
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1-5" })
    }

    // 1. Check technician exists
    const techRef = db.collection("technicians").doc(technicianId)
    const techSnap = await techRef.get()

    if (!techSnap.exists) {
      return res.status(404).json({ message: "Technician not found" })
    }

    // 2. Prevent duplicate rating
    const existingRating = await db
      .collection("ratings")
      .where("technicianId", "==", technicianId)
      .where("customerId", "==", customerId)
      .get()

    if (!existingRating.empty) {
      return res.status(400).json({ message: "Already rated this technician" })
    }

    // 3. Save rating
    await db.collection("ratings").add({
      technicianId,
      customerId,
      rating: numericRating,
      review,
      createdAt: new Date()
    })

    // 4. Update technician rating stats
    const techData = techSnap.data()
    const newTotalReviews = techData.totalReviews + 1
    const newAverageRating =
      (techData.averageRating * techData.totalReviews + numericRating) /
      newTotalReviews

    await techRef.update({
      totalReviews: newTotalReviews,
      averageRating: Number(newAverageRating.toFixed(1))
    })

    res.json({ message: "Rating submitted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Failed to add rating" })
  }
}

export const getReviews = async (req, res) => {
  try {
    const { technicianId } = req.params

    const snapshot = await db
      .collection("ratings")
      .where("technicianId", "==", technicianId)
      // .orderBy("createdAt", "desc") // Removed to avoid index requirement
      .get()

    const reviews = []
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let totalRatingSum = 0

    // Fetch user details for each review
    const customerPromises = snapshot.docs.map(async (doc) => {
      const data = doc.data()
      ratingCounts[data.rating] = (ratingCounts[data.rating] || 0) + 1
      totalRatingSum += data.rating

      const userSnap = await db.collection("users").doc(data.customerId).get()
      const userData = userSnap.data() || {}

      return {
        id: doc.id,
        ...data,
        customerName: userData.name || "Anonymous",
        customerPhotoUrl: userData.profilePic || null,
      }
    })

    let resolvedReviews = await Promise.all(customerPromises)

    // Sort in memory (newest first)
    resolvedReviews.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
      return dateB - dateA
    })

    const totalReviews = resolvedReviews.length
    const averageRating = totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : 0

    res.json({
      reviews: resolvedReviews,
      stats: {
        totalReviews,
        averageRating,
        ratingCounts,
      },
    })
  } catch (error) {
    console.error("Get reviews error", error)
    res.status(500).json({ message: "Failed to fetch reviews" })
  }
}