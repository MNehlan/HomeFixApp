import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContextDefinition"
import { useNavigate } from "react-router-dom"
// import Admindashboard from "../../pages/admin/Admindashboard"

const AdminSidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate("/auth")
    }

    const menuItems = [
        { name: "Overview", path: "/admin", icon: "📊" },
        { name: "Users", path: "/admin/users", icon: "👥" },
        { name: "Jobs History", path: "/admin/jobs", icon: "📋" },
        { name: "Reports", path: "/admin/reports", icon: "⚠️" },
    ]

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            <div className={`
                w-64 bg-white h-screen border-r flex flex-col shrink-0 
                fixed inset-y-0 left-0 z-[60] transition-transform duration-300 transform
                lg:translate-x-0 lg:sticky lg:top-0
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <NavLink
                    to="/admin"
                    className="p-6 flex items-center justify-between gap-3 group border-b border-transparent hover:bg-slate-50 transition-colors"
                    onClick={() => { if (window.innerWidth < 1024) onClose() }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-xl">H</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 leading-none">HomeFix</h2>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin Panel</span>
                        </div>
                    </div>
                    {/* Close button for mobile - moved outside of link if needed but link covers it now, 
                        actually better to keep it separate or handle it. 
                        Wait, the close button was inside the p-6 div. 
                        Let's keep it separate for functionality. */}
                </NavLink>
                <button onClick={onClose} className="lg:hidden absolute top-6 right-6 text-slate-400 hover:text-black p-1 z-10">
                    ✕
                </button>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => { if (window.innerWidth < 1024) onClose() }}
                            end={item.path === "/admin"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`
                            }
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
                    >
                        <span>🚪</span>
                        Logout
                    </button>
                </div>
            </div>
        </>
    )
}

export default AdminSidebar
