import { useState } from "react"
import { Outlet, Link } from "react-router-dom"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { Menu, Command } from "lucide-react"

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] overflow-hidden selection:bg-slate-900 selection:text-white">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-[72px] bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-5 flex items-center justify-between z-40 shadow-sm">
                <Link to="/admin" className="flex items-center gap-3 group active:scale-95 transition-transform duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-950 rounded-xl flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:shadow-lg transition-all duration-300">
                        <Command className="text-white w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-[17px] text-slate-900 tracking-tight leading-tight">HomeFix</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight">Admin</span>
                    </div>
                </Link>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors active:scale-95"
                >
                    <Menu size={24} />
                </button>
            </header>

            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto lg:ml-0 pt-[72px] lg:pt-0 pb-12 w-full max-w-full">
                <div className="w-full mx-auto p-4 md:p-8 xl:p-10 max-w-[1600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default AdminLayout
