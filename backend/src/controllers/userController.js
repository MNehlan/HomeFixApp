import { db } from "../config/firebase.js"

export const getProfile = async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.user.uid)
    const userSnap = await userRef.get()

    if (!userSnap.exists) {
      return res.status(404).json({ message: "Profile not found" })
    }

    const userData = userSnap.data()
    let technician = null

    if (userData.roles?.includes("technician")) {
      const techSnap = await db.collection("technicians").doc(req.user.uid).get()
      technician = techSnap.exists ? techSnap.data() : null
    }

    res.json({
      uid: req.user.uid,
      ...userData,
      technician,
    })
  } catch (error) {
    console.error("Profile fetch error", error)
    res.status(500).json({ message: "Failed to load profile" })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.file) data.profilePic = req.file.path

    const userRef = db.collection("users").doc(req.user.uid)
    await userRef.update(data)

    // If technician-specific fields are provided, update technician doc too
    const technicianUpdates = {}
    if (req.body.category) technicianUpdates.category = req.body.category
    if (req.body.experience) technicianUpdates.experience = req.body.experience
    if (req.body.price !== undefined)
      technicianUpdates.price = Number(req.body.price) || 0
    if (req.body.bio !== undefined) technicianUpdates.bio = req.body.bio

    if (Object.keys(technicianUpdates).length > 0) {
      await db
        .collection("technicians")
        .doc(req.user.uid)
        .set(
          {
            ...technicianUpdates,
            updatedAt: new Date(),
          },
          { merge: true }
        )
    }

    res.json({ message: "Profile updated" })
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" })
  }
}

export const uploadFile = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" })
  res.json({ url: req.file.path })
}
