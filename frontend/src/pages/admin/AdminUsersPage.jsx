import { useEffect, useState, useCallback } from "react"
import { getAllUsers } from "../../services/adminService"
import AdminUserDetailModal from "../../components/admin/AdminUserDetailModal"

const AdminUsersPage = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState("all") // 'all', 'customer', 'technician'

    const loadUsers = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getAllUsers()
            setUsers(data.filter(u => u.role !== 'admin'))
        } catch (err) {
            console.error("Failed to load users", err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadUsers()
    }, [loadUsers])

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesRole = filterRole === 'all' ||
            (filterRole === 'customer' && u.role === 'customer') ||
            (filterRole === 'technician' && (u.role === 'technician' || u.roles?.includes('technician')))

        return matchesSearch && matchesRole
    })

    const getRoleBadge = (u) => {
        if (u.role === 'technician' || u.roles?.includes('technician')) {
            return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">Technician</span>
        }
        return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">Customer</span>
    }

    if (loading) return <div className="text-center py-10">Loading users...</div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500 text-sm">Manage customers and technicians</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Role Filter Pills */}
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {['all', 'customer', 'technician'].map(role => (
                            <button
                                key={role}
                                onClick={() => setFilterRole(role)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${filterRole === role
                                    ? "bg-white text-black shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-64">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 grayscale">🔍</span>
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((u) => (
                                <tr key={u.uid} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border">
                                                {u.profilePic ? (
                                                    <img src={u.profilePic} alt={u.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                                                        {u.name?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{u.name}</div>
                                                <div className="text-slate-500 text-xs">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getRoleBadge(u)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.technicianStatus === 'APPROVED' ? (
                                            <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified
                                            </span>
                                        ) : u.technicianStatus === 'PENDING' ? (
                                            <span className="text-orange-500 font-bold text-xs flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Pending
                                            </span>
                                        ) : u.technicianStatus === 'REJECTED' ? (
                                            <span className="text-red-500 font-bold text-xs flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-red-500"></span> Rejected
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">User</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedUser(u)}
                                            className="text-black font-bold text-xs hover:bg-black hover:text-white px-3 py-1.5 rounded-lg border border-black transition-all"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                        <div key={u.uid} className="p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border">
                                    {u.profilePic ? (
                                        <img src={u.profilePic} alt={u.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-bold text-xl text-slate-400">
                                            {u.name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-slate-900 truncate">{u.name}</div>
                                    <div className="text-slate-500 text-xs truncate uppercase tracking-widest font-bold mt-0.5">{u.email}</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role & Status</span>
                                    <div className="flex items-center gap-2">
                                        {getRoleBadge(u)}
                                        {u.technicianStatus === 'APPROVED' && (
                                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Verified"></span>
                                        )}
                                        {u.technicianStatus === 'PENDING' && (
                                            <span className="w-2 h-2 rounded-full bg-orange-500" title="Pending"></span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedUser(u)}
                                    className="bg-black text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-black/20 active:scale-95 transition-transform"
                                >
                                    Manage User
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredUsers.length === 0 && (
                    <div className="p-10 text-center text-slate-400 italic font-medium">No users found matching your criteria.</div>
                )}
            </div>

            <AdminUserDetailModal
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                user={selectedUser}
                onUpdate={loadUsers}
            />
        </div>
    )
}

export default AdminUsersPage
