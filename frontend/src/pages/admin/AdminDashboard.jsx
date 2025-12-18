import { useEffect, useState } from "react"
import {
  getPendingTechnicians,
  verifyTechnician,
  getAllUsers,
} from "../../services/adminService"
import VerifyTechnicianCard from "../../components/admin/VerifyTechnicianCard"

const AdminDashboard = () => {
  const [pending, setPending] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPending = async () => {
    setLoading(true)
    try {
      const data = await getPendingTechnicians()
      setPending(data)
      const allUsers = await getAllUsers()
      setUsers(allUsers)
    } catch (err) {
      console.error("Failed to load technicians", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPending()
  }, [])

  const handleApprove = async (userId) => {
    await verifyTechnician(userId, "APPROVED")
    loadPending()
  }

  const handleReject = async (userId) => {
    await verifyTechnician(userId, "REJECTED")
    loadPending()
  }

  if (loading) return <p className="p-4">Loading...</p>

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Pending Technician Requests
        </h1>

        {pending.length === 0 ? (
          <p>No pending technicians</p>
        ) : (
          <div className="space-y-4">
            {pending.map((tech) => (
              <VerifyTechnicianCard
                key={tech.uid}
                technician={tech}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">All Users</h2>
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Role</th>
                <th className="px-3 py-2 text-left">Technician Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.uid} className="border-t">
                  <td className="px-3 py-2">{u.name}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2 capitalize">{u.role}</td>
                  <td className="px-3 py-2">{u.technicianStatus || "NONE"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
