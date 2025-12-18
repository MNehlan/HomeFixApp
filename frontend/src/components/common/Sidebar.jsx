import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Sidebar = () => {
  const { user } = useAuth()

  return (
    <aside className="w-56 border-r h-screen p-4 space-y-3">
      {user?.role === "admin" && (
        <Link to="/admin" className="block">Admin Dashboard</Link>
      )}

      {user?.roles?.includes("technician") && (
        <Link to="/technician" className="block">Technician Dashboard</Link>
      )}

      {user?.roles?.includes("customer") && (
        <Link to="/customer" className="block">Customer Dashboard</Link>
      )}
    </aside>
  )
}

export default Sidebar
