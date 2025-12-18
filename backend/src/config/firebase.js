import dotenv from "dotenv"
import admin from "firebase-admin"
import fs from "fs"

// Load environment variables for Firebase Admin
dotenv.config()

const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH

if (!serviceAccountPath) {
  throw new Error("SERVICE_ACCOUNT_KEY_PATH is not defined in .env")
}

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf-8")
)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export const auth = admin.auth()
export const db = admin.firestore()
