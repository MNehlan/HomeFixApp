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