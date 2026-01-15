import { auth, db } from "../config/firebase.js"

export const bootstrapAdmin = async () => {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME || "Admin"

  let adminUser

  try {
    // 1️⃣ Check if admin exists in Firebase Auth
    adminUser = await auth.getUserByEmail(email)
    // console.log("✅ Admin already exists in Firebase Auth")
  } catch (error) {
    // 2️⃣ If not exists → create admin in Firebase Auth
    if (error.code === "auth/user-not-found") {
      adminUser = await auth.createUser({
        email,
        password,
      })
      // console.log("🚀 Admin created in Firebase Auth")
    } else {
      throw error
    }
  }

  // 3️⃣ Check Firestore admin profile
  const adminDocRef = db.collection("users").doc(adminUser.uid)
  const adminDoc = await adminDocRef.get()

  if (!adminDoc.exists) {
    // 4️⃣ Create admin profile in Firestore
    await adminDocRef.set({
      name,
      email,
      role: "admin",
      roles: ["admin"],
      createdAt: new Date(),
    })

    // console.log("📁 Admin profile created in Firestore")
  } else {
    // console.log("📁 Admin profile already exists in Firestore")
  }
}
