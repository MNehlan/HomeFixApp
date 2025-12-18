import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import Login from "../components/auth/Login"
import Register from "../components/auth/Register"

const AuthPage = () => {
  const [searchParams] = useSearchParams()
  const initialMode =
    searchParams.get("mode") === "register" ? "register" : "login"
  const [mode, setMode] = useState(initialMode)

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Home Fix Account
          </h1>
          <p className="text-slate-600 text-sm">
            Log in to manage your bookings, technician profile, or admin
            approvals. New here? Create a customer account in seconds.
          </p>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Secure Firebase authentication</li>
            <li>• Role-based dashboards for customer, technician, and admin</li>
            <li>• Ratings, profiles, and verification built-in</li>
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-3 flex gap-2 self-stretch">
            <button
              className={`flex-1 px-4 py-2 rounded-lg text-sm ${
                mode === "login"
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 border"
              }`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded-lg text-sm ${
                mode === "register"
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 border"
              }`}
              onClick={() => setMode("register")}
            >
              Sign up as Customer
            </button>
          </div>

          {mode === "login" ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  )
}

export default AuthPage
