
import { useEffect, useState } from "react"
import {
  getPendingTechnicians,
  verifyTechnician,
  getAllUsers,
  getDashboardStats,
} from "../../services/adminService"
import VerifyTechnicianCard from "../../components/admin/VerifyTechnicianCard"
import AdminUserDetailModal from "../../components/admin/AdminUserDetailModal"
import { useAuth } from "../../context/AuthContextDefinition"
import { useNavigate } from "react-router-dom"

const AdminDashboard = () => {
  const [pending, setPending] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)

  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const pendingData = await getPendingTechnicians()
      const usersData = await getAllUsers()
      const statsData = await getDashboardStats()

      setPending(pendingData)
      // Filter out admins from the user list
      setUsers(usersData.filter(u => u.role !== 'admin'))
      setStats(statsData)
    } catch (err) {
      console.error("Failed to load admin data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleApprove = async (userId) => {
    await verifyTechnician(userId, "APPROVED")
    loadData()
  }

  const handleReject = async (userId) => {
    await verifyTechnician(userId, "REJECTED")
    loadData()
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
  )

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">Welcome back, Admin</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-medium uppercase">Total Users</h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-medium uppercase">Total Technicians</h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">{stats.totalTechnicians}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-emerald-600 text-sm font-medium uppercase">Active Jobs</h3>
            <p className="text-3xl font-bold text-slate-800 mt-2">{stats.activeJobs}</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Pending Requests Column */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Pending Requests
            {pending.length > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">{pending.length}</span>}
          </h2>

          <div className="space-y-4">
            {pending.length === 0 ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border text-center text-slate-400">
                No pending requests
              </div>
            ) : (
              pending.map((tech) => (
                <VerifyTechnicianCard
                  key={tech.uid}
                  technician={tech}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))
            )}
          </div>
        </div>

        {/* All Users Table Column */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">User Management</h2>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr
                      key={u.uid}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedUser(u)}
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                            {u.profilePic ? (
                              <img src={u.profilePic} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                                {u.name?.[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            {u.name}
                            <div className="text-xs text-slate-400 font-normal">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <span className={`px - 2 py - 1 rounded text - xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'technician' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'} `}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.technicianStatus === 'PENDING' ? (
                          <span className="text-orange-600 font-semibold text-xs">Pending Approval</span>
                        ) : u.technicianStatus === 'APPROVED' ? (
                          <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1">Verified</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


      <AdminUserDetailModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
        onUpdate={loadData}
      />
    </div >
  )
}

export default AdminDashboard
