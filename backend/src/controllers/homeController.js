import { db } from "../config/firebase.js"

export const getHomeData = async (req, res) => {
  try {
    // 1. Get Top Rated Technicians (limit 3)
    const topTechsSnap = await db
      .collection("technicians")
      .orderBy("averageRating", "desc")
      .limit(3)
      .get()

    // Fetch user details for these techs to get names
    const topTechs = await Promise.all(
      topTechsSnap.docs.map(async (doc) => {
        const userSnap = await db.collection("users").doc(doc.id).get()
        return {
          uid: doc.id,
          name: userSnap.exists ? userSnap.data().name : "Unknown",
          ...doc.data(),
        }
      })
    )

    // 2. Get Statistics (Technicians count) & Categories
    // calculating unique categories might be expensive on large DBs, 
    // but for now we iterate (or we could keep a separate stats doc)
    const techsSnap = await db.collection("technicians").get()
    const allCategories = new Set()
    techsSnap.docs.forEach(doc => {
      if (doc.data().category) allCategories.add(doc.data().category)
    })

    res.json({
      topTechnicians: topTechs,
      categories: Array.from(allCategories),
      totalTechnicians: techsSnap.size
    })
  } catch (error) {
    console.error("Home data error:", error)
    res.status(500).json({ message: "Failed to load home data" })
  }
}
