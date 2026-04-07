import { useEffect, useState } from "react"
import {
    getPendingTechnicians,
    verifyTechnician,
    getDashboardStats,
} from "../../services/adminService"
import VerifyTechnicianCard from "../../components/admin/VerifyTechnicianCard"
import { Users, ShieldCheck, Briefcase, ChevronRight, Activity } from "lucide-react"

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

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Activity className="w-8 h-8 animate-pulse mb-4" />
            <p className="font-semibold tracking-wide">Loading overview...</p>
        </div>
    )

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col gap-1.5">
                <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight">Dashboard Overview</h1>
                <p className="text-slate-500 font-medium text-[15px]">Monitor key platform metrics and manage pending applications.</p>
            </div>

            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Total Users */}
                    <div className="bg-white p-6 rounded-[24px] shadow-sm shadow-slate-200/50 border border-slate-100/80 flex flex-col justify-between group hover:shadow-md hover:border-slate-200 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-110 duration-500">
                            <Users size={120} />
                        </div>
                        <div className="flex items-center gap-3.5 mb-6">
                            <div className="w-11 h-11 rounded-[14px] bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                                <Users size={22} />
                            </div>
                            <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Total Users</h3>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-[42px] leading-none font-black text-slate-900 group-hover:scale-105 transition-transform origin-left duration-300">{stats.totalUsers}</p>
                            <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-800 transition-colors opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-300 mb-1" />
                        </div>
                    </div>
                    {/* Verified Technicians */}
                    <div className="bg-white p-6 rounded-[24px] shadow-sm shadow-slate-200/50 border border-slate-100/80 flex flex-col justify-between group hover:shadow-md hover:border-blue-100 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 text-blue-600 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-110 duration-500">
                            <ShieldCheck size={120} />
                        </div>
                        <div className="flex items-center gap-3.5 mb-6">
                            <div className="w-11 h-11 rounded-[14px] bg-blue-50/50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <ShieldCheck size={22} />
                            </div>
                            <h3 className="text-blue-500 text-[11px] font-bold uppercase tracking-widest">Verified Techs</h3>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-[42px] leading-none font-black text-slate-900 group-hover:scale-105 transition-transform origin-left duration-300">{stats.totalTechnicians}</p>
                            <ChevronRight size={20} className="text-blue-200 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-300 mb-1" />
                        </div>
                    </div>
                    {/* Active Jobs */}
                    <div className="bg-white p-6 rounded-[24px] shadow-sm shadow-slate-200/50 border border-slate-100/80 flex flex-col justify-between group hover:shadow-md hover:border-emerald-100 transition-all duration-300 relative overflow-hidden sm:col-span-2 lg:col-span-1">
                        <div className="absolute top-0 right-0 p-6 text-emerald-600 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-110 duration-500">
                            <Briefcase size={120} />
                        </div>
                        <div className="flex items-center gap-3.5 mb-6">
                            <div className="w-11 h-11 rounded-[14px] bg-emerald-50/50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                <Briefcase size={22} />
                            </div>
                            <h3 className="text-emerald-500 text-[11px] font-bold uppercase tracking-widest">Active Jobs</h3>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-[42px] leading-none font-black text-slate-900 group-hover:scale-105 transition-transform origin-left duration-300">{stats.activeJobs}</p>
                            <ChevronRight size={20} className="text-emerald-200 group-hover:text-emerald-600 transition-colors opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-300 mb-1" />
                        </div>
                    </div>
                </div>
            )}

            {/* Pending Requests */}
            <div className="space-y-6 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        Pending Applications
                        {pending.length > 0 && (
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-black flex items-center gap-1.5 border border-amber-200/50 uppercase tracking-widest shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                {pending.length} New
                            </span>
                        )}
                    </h2>
                </div>

                {pending.length === 0 ? (
                    <div className="bg-white/50 p-16 rounded-[24px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                            <ShieldCheck className="text-slate-300 w-8 h-8" />
                        </div>
                        <p className="text-slate-500 font-semibold mb-1">You're all caught up!</p>
                        <p className="text-slate-400 text-sm">No pending applications at the moment.</p>
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
