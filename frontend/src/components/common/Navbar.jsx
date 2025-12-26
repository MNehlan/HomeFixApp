import { useState, useRef, useEffect } from "react"
import { useAuth } from "../../context/AuthContextDefinition"
import { useNavigate } from "react-router-dom"
import ProfileModal from "./ProfileModal"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = async () => {
    await logout()
    navigate("/auth")
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-3 border-b bg-white relative z-40">
        <h1 className="font-bold text-xl cursor-pointer" onClick={() => navigate("/")}>
          HomeFix
        </h1>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-lg">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                  )}
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      setShowProfileModal(true)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  )
}

export default Navbar
