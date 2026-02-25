import { useEffect, useState } from "react"
import {
    getPendingTechnicians,
    verifyTechnician,
    getDashboardStats,
} from "../../services/adminService"
import VerifyTechnicianCard from "../../components/admin/VerifyTechnicianCard"

const DashboardOverview = () => {
    const [pending, setPending] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const loadData = async () => {
        setLoading(true)
        try {
            const pendingData = await getPendingTechnicians()
            const statsData = await getDashboardStats()
            setPending(pendingData)
            setStats(statsData)
        } catch (err) {
            console.error("Failed to load overview data", err)
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

    const handleReject = async (userId, reason) => {
        await verifyTechnician(userId, "REJECTED", reason)
        loadData()
    }

    if (loading) return <div className="text-center py-10">Loading overview...</div>

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Overview</h1>
                <p className="text-slate-500 font-medium">Monitor your platform's growth and pending actions.</p>
            </div>

            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-slate-200 transition-all duration-300">
                        <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Users</h3>
                        <p className="text-4xl font-black text-slate-900 mt-4 group-hover:scale-110 transition-transform origin-left">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-blue-100 transition-all duration-300">
                        <h3 className="text-blue-500 text-[10px] font-bold uppercase tracking-widest">Verified Technicians</h3>
                        <p className="text-4xl font-black text-slate-900 mt-4 group-hover:scale-110 transition-transform origin-left">{stats.totalTechnicians}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-emerald-100 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                        <h3 className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Active Jobs</h3>
                        <p className="text-4xl font-black text-slate-900 mt-4 group-hover:scale-110 transition-transform origin-left">{stats.activeJobs}</p>
                    </div>
                </div>
            )}

            {/* Pending Requests */}
            <div className="space-y-6 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        New Technician Applications
                        {pending.length > 0 && (
                            <span className="text-[10px] bg-red-50 text-red-600 px-3 py-1 rounded-full font-black animate-pulse border border-red-100 uppercase tracking-wider">
                                {pending.length} Action Needed
                            </span>
                        )}
                    </h2>
                </div>

                {pending.length === 0 ? (
                    <div className="bg-white p-16 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400 font-medium">
                        No pending applications at the moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
        </div>
    )
}

export default DashboardOverview
