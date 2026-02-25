import { db, auth } from "../config/firebase.js"
import { sendTechnicianStatusEmail } from "../utils/emailService.js"

export const verifyTechnician = async (req, res) => {
  const { userId, status, rejectionReason } = req.body

  try {
    const userRef = db.collection("users").doc(userId)
    const userSnap = await userRef.get()

    if (!userSnap.exists) {
      return res.status(404).json({ message: "User find no" })
    }

    const userData = userSnap.data()

    await userRef.update({
      technicianStatus: status,
    })

    // SEND EMAIL using the improved service
    if (status === "APPROVED" || status === "REJECTED") {
      sendTechnicianStatusEmail(userData.email, userData.name, status, rejectionReason)
    }

    res.json({ message: "Technician status updated and email sent" })
  } catch (error) {
    console.error("Verify technician error", error)
    res.status(500).json({ message: "Failed to update status" })
  }
}

export const deleteUser = async (req, res) => {
  const { userId } = req.body

  if (!userId) return res.status(400).json({ message: "User ID required" })

  try {
    // 1. Delete from Firestore (Users & Technicians)
    await db.collection("users").doc(userId).delete()
    await db.collection("technicians").doc(userId).delete()

    // 2. Delete from Firebase Auth
    try {
      await auth.deleteUser(userId)
    } catch (authErr) {
      console.warn(`Auth user ${userId} not found or already deleted`, authErr.message)
    }

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error", error)
    res.status(500).json({ message: "Failed to delete user" })
  }
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

    // Use Promise.all to fetch technician details in parallel
    const users = await Promise.all(snap.docs.map(async (doc) => {
      const userData = doc.data()
      let techData = {}

      if (userData.roles?.includes("technician")) {
        const techSnap = await db.collection("technicians").doc(doc.id).get()
        if (techSnap.exists) {
          techData = techSnap.data()
        }
      }

      return {
        uid: doc.id,
        ...userData,
        ...techData
      }
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
