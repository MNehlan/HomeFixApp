import { db } from "../config/firebase.js"

export const verifyTechnician = async (req, res) => {
  const { userId, status } = req.body

  await db.collection("users").doc(userId).update({
    technicianStatus: status,
  })

  res.json({ message: "Technician status updated" })
}

export const getPendingTechnicians = async (_req, res) => {
  try {
    const pendingSnap = await db
      .collection("users")
      .where("technicianStatus", "==", "PENDING")
      .get()

    const pending = []

    for (const doc of pendingSnap.docs) {
      const techDoc = await db.collection("technicians").doc(doc.id).get()
      pending.push({
        uid: doc.id,
        ...doc.data(),
        ...(techDoc.exists ? techDoc.data() : {}),
      })
    }

    res.json(pending)
  } catch (error) {
    console.error("Pending technicians error", error)
    res.status(500).json({ message: "Failed to load technicians" })
  }
}

export const getAllUsers = async (_req, res) => {
  try {
    const snap = await db.collection("users").get()
    const users = snap.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }))
    res.json(users)
  } catch (error) {
    console.error("Users fetch error", error)
    res.status(500).json({ message: "Failed to load users" })
  }
}

export const getDashboardStats = async (_req, res) => {
  try {
    const usersSnap = await db.collection("users").get()
    const techsSnap = await db.collection("technicians").get()
    const pendingSnap = await db.collection("users").where("technicianStatus", "==", "PENDING").get()

    // Simple Booking stats (if ratings collection can be used as proxy for activity, or just return 0 if no bookings collection yet)
    // Checking previous file info, there is no "bookings" collection mentioned in controllers unless I missed it.
    // I see "ratings" collection. I'll just count ratings as "completed jobs" proxy or return 0.
    // Wait, the user asked to "improve and add features". I should add a bookings stat if possible.
    // But without a bookings collection, I can't.
    // I will return basic stats for now.

    res.json({
      totalUsers: usersSnap.size,
      totalTechnicians: techsSnap.size,
      pendingApprovals: pendingSnap.size,
      activeJobs: 0 // Placeholder
    })
  } catch (error) {
    console.error("Stats error", error)
    res.status(500).json({ message: "Failed to load stats" })
  }
}
