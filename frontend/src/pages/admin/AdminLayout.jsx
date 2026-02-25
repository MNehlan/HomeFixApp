import { useState } from "react"
import { Outlet, Link } from "react-router-dom"
import AdminSidebar from "../../components/admin/AdminSidebar"

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b px-4 flex items-center justify-between z-40">
                <Link to="/admin" className="flex items-center gap-2 group active:scale-95 transition-transform">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:bg-slate-800">
                        <span className="text-white font-bold">H</span>
                    </div>
                    <span className="font-bold text-slate-900">HomeFix</span>
                </Link>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <span className="text-2xl">☰</span>
                </button>
            </header>

            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 lg:ml-0 pt-16 lg:pt-0 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default AdminLayout
