import { useAuth } from "../../context/AuthContext"

const TechnicianPending = () => {
  const { user } = useAuth()

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
    </div>
  )
}

export default TechnicianPending
