import { auth, db } from "../config/firebase.js"

const extractToken = (req) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null
  return authHeader.split(" ")[1]
}

const registerWithRole = async (req, res, accountType = "customer") => {
  try {
    const token = extractToken(req)
    if (!token) return res.status(401).json({ message: "No token provided" })

    const decoded = await auth.verifyIdToken(token)
    const { name, category, experience, price, bio = "", photoUrl } = req.body

    // Prevent duplicate profile creation
    const userRef = db.collection("users").doc(decoded.uid)
    const existing = await userRef.get()
    if (existing.exists) {
      return res.json({
        message: "Profile already exists",
        profile: { uid: decoded.uid, ...existing.data() },
      })
    }

    // Admin guardrail - admin should already be bootstrapped
    if (decoded.email === process.env.ADMIN_EMAIL) {
      return res.status(400).json({
        message: "Admin account is managed by the server bootstrap process",
      })
    }

    // Build base profile
    const baseProfile = {
      name,
      email: decoded.email,
      createdAt: new Date(),
      profilePic: photoUrl || "",
      technicianStatus: "NONE",
      role: "customer",
      roles: ["customer"],
    }

    if (accountType === "technician") {
      baseProfile.role = "technician"
      baseProfile.roles = ["technician"]
      baseProfile.technicianStatus = "PENDING"
    }

    await userRef.set(baseProfile)

    // When registering directly as technician create technician record
    if (accountType === "technician") {
      await db
        .collection("technicians")
        .doc(decoded.uid)
        .set({
          category: category || "",
          experience: experience || "",
          price: Number(price) || 0,
          bio,
          averageRating: 0,
          totalReviews: 0,
          createdAt: new Date(),
        })
    }

    return res.json({
      message: "User registered",
      profile: { uid: decoded.uid, ...baseProfile },
    })
  } catch (error) {
    console.error("Register error", error)
    return res.status(500).json({ message: "Failed to register user" })
  }
}

export const registerUser = (req, res) => registerWithRole(req, res, "customer")

export const registerTechnician = (req, res) =>
  registerWithRole(req, res, "technician")
