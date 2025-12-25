import { db } from "../config/firebase.js"

export const applyTechnician = async (req, res) => {
  const { category, price, experience, bio = "", city = "", photoUrl } = req.body

  await db
    .collection("technicians")
    .doc(req.user.uid)
    .set(
      {
        category: category || "",
        price: Number(price) || 0,
        experience: experience || "",
        bio,
        city: city.toLowerCase(), // Save normalized for easier search
        averageRating: 0,
        totalReviews: 0,
        updatedAt: new Date(),
      },
      { merge: true }
    )

  const roles = Array.from(new Set([...(req.user.roles || []), "technician"]))

  const userUpdates = {
    role: "technician",
    technicianStatus: "PENDING",
    roles,
  }

  if (photoUrl) {
    userUpdates.profilePic = photoUrl
  }

  await db.collection("users").doc(req.user.uid).update(userUpdates)

  res.json({ message: "Technician application submitted", status: "PENDING" })
}

export const getTechnicianProfile = async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.user.uid)
    const userSnap = await userRef.get()

    if (!userSnap.exists) {
      return res.status(404).json({ message: "User not found" })
    }

    if (!userSnap.data().roles?.includes("technician")) {
      return res.status(403).json({ message: "Not a technician" })
    }

    const techSnap = await db.collection("technicians").doc(req.user.uid).get()
    if (!techSnap.exists) {
      return res.status(404).json({ message: "Technician profile missing" })
    }

    res.json({
      uid: req.user.uid,
      technicianStatus: userSnap.data().technicianStatus,
      name: userSnap.data().name,
      email: userSnap.data().email,
      profilePic: userSnap.data().profilePic || "",
      ...techSnap.data(),
    })
  } catch (error) {
    console.error("Technician profile error", error)
    res.status(500).json({ message: "Failed to load technician profile" })
  }
}
