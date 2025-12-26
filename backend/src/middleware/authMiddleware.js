import { auth, db } from "../config/firebase.js"

/**
 * Middleware to verify Firebase token
 * and attach user data to request
 */
export const verifyToken = async (req, res, next) => {
  try {
    // 1️⃣ Get token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" })
    }

    const token = authHeader.split(" ")[1]

    // 2️⃣ Verify Firebase token
    const decoded = await auth.verifyIdToken(token)

    // 3️⃣ Fetch user profile from Firestore
    // 3️⃣ Fetch user profile from Firestore (if exists)
    const userRef = db.collection("users").doc(decoded.uid)
    const userSnap = await userRef.get()

    let userData = {}
    if (userSnap.exists) {
      userData = userSnap.data()
    } else {
      // NOTE: Allow request to proceed even if profile is missing
      // This is required for "Upload" during registration flow
      console.log(`⚠️ Profile missing for ${decoded.uid}, treating as new user.`)
    }

    // 4️⃣ Force admin role ONLY for predefined admin email
    let role = userData.role || "customer"

    if (decoded.email === process.env.ADMIN_EMAIL) {
      role = "admin"
    }

    // 5️⃣ Attach safe user object to request
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role,
      roles: userData.roles || ["customer"],
      technicianStatus: userData.technicianStatus || "NONE",
      name: userData.name || ""
    }

    next()
  } catch (error) {
    console.error("Auth Error:", error.message)
    return res.status(401).json({ message: "Unauthorized" })
  }
}
