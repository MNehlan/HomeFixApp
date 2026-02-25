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
      <nav className="sticky top-0 w-full flex justify-between items-center px-4 md:px-6 py-3 border-b bg-white/80 backdrop-blur-md z-[100] transition-all">
        <h1 className="font-bold text-xl cursor-pointer tracking-tight" onClick={() => navigate("/")}>
          HomeFix
        </h1>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-transparent group-hover:border-slate-200 transition-all">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg bg-slate-100">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                  )}
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-wider mt-0.5">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      setShowProfileModal(true)
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                  >
                    <span>👤</span> Edit Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 flex items-center gap-2 mt-1"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="bg-black text-white px-5 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-black/20"
            >
              Login
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
