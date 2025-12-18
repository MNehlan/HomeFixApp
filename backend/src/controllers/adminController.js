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
