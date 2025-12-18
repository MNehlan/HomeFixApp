import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/auth")
  }

  return (
    <nav className="flex justify-between items-center px-6 py-3 border-b">
      <h1 className="font-bold text-xl">HomeFix</h1>

      <div className="flex items-center gap-4">
        {user && <span>{user.name}</span>}
        <button
          onClick={handleLogout}
          className="bg-black text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
