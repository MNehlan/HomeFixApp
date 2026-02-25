import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContextDefinition"

const TechnicianPending = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        Technician Verification Pending
      </h1>
      <p>
        Hello <b>{user?.name}</b>, your technician profile is under admin
        verification.
      </p>
      <p className="mt-2 text-gray-600">
        You will get full access once approved.
      </p>

      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <button
          onClick={() => window.location.href = "/"}
          className="px-6 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
        >
          Return to Home
        </button>
        <button
          onClick={async () => {
            await logout()
            navigate("/")
          }}
          className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default TechnicianPending
