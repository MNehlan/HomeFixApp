import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContextDefinition"
import { useNavigate } from "react-router-dom"
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    AlertTriangle,
    LogOut,
    X,
    Command
} from "lucide-react"

const AdminSidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate("/auth")
    }

    const menuItems = [
        { name: "Overview", path: "/admin", icon: <LayoutDashboard size={20} /> },
        { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
        { name: "Jobs History", path: "/admin/jobs", icon: <ClipboardList size={20} /> },
        { name: "Reports", path: "/admin/reports", icon: <AlertTriangle size={20} /> },
    ]

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 z-50 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            <div className={`
                w-[280px] bg-white h-screen border-r border-slate-200 flex flex-col shrink-0 
                fixed inset-y-0 left-0 z-[60] transition-transform duration-300 transform
                lg:translate-x-0 lg:sticky lg:top-0
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                shadow-2xl lg:shadow-none
            `}>
                <NavLink
                    to="/admin"
                    className="h-20 px-6 flex items-center justify-between gap-3 group border-b border-slate-100/80 hover:bg-slate-50/50 transition-colors"
                    onClick={() => { if (window.innerWidth < 1024) onClose() }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-950 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20 group-hover:scale-105 transition-transform duration-300">
                            <Command size={20} />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="font-bold text-slate-900 text-[17px] tracking-tight leading-tight">HomeFix</h2>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight mt-0.5">Admin Portal</span>
                        </div>
                    </div>
                </NavLink>

                <button 
                    onClick={onClose} 
                    className="lg:hidden absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors z-10"
                >
                    <X size={16} />
                </button>

                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    <div className="mb-4 px-4">
                        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Main Navigation</p>
                    </div>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => { if (window.innerWidth < 1024) onClose() }}
                            end={item.path === "/admin"}
                            className={({ isActive }) =>
                                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 ${isActive
                                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                                    : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
                                }`
                            }
                        >
                            <span className={({ isActive }) => isActive ? "text-white" : "text-slate-400"}>
                                {item.icon}
                            </span>
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100/80 bg-slate-50/30">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition-all group"
                    >
                        <LogOut size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default AdminSidebar
