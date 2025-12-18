import { db } from "../config/firebase.js"

export const searchTechnicians = async (req, res) => {
  try {
    const { category, minRating, sortByPrice } = req.query

    // 1. Get approved technicians
    let techQuery = db
      .collection("users")
      .where("technicianStatus", "==", "APPROVED")

    const techUsers = await techQuery.get()

    let results = []

    // 2. Combine user + technician data
    for (const userDoc of techUsers.docs) {
      const techDoc = await db
        .collection("technicians")
        .doc(userDoc.id)
        .get()

      if (!techDoc.exists) continue

      const techData = techDoc.data()

      // 3. Apply filters
      if (category && techData.category !== category) continue
      if (minRating && techData.averageRating < Number(minRating)) continue

      results.push({
        technicianId: userDoc.id,
        name: userDoc.data().name,
        profilePic: userDoc.data().profilePic || null,
        ...techData
      })
    }

    // 4. Sort by price
    if (sortByPrice === "low") {
      results.sort((a, b) => a.price - b.price)
    }
    if (sortByPrice === "high") {
      results.sort((a, b) => b.price - a.price)
    }

    res.json(results)
  } catch (err) {
    res.status(500).json({ message: "Search failed" })
  }
}
