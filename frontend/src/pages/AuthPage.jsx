import { useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import Login from "../components/auth/Login"
import Register from "../components/auth/Register"
import ForgotPassword from "../components/auth/ForgotPassword"

const AuthPage = () => {
  const [searchParams] = useSearchParams()
  const initialMode =
    searchParams.get("mode") === "register" ? "register" : "login"
  const [mode, setMode] = useState(initialMode)

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Modern Abstract/Branding */}
        <div className="hidden md:flex flex-col justify-center space-y-6">
          <Link to="/" className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center transition hover:scale-105">
            <span className="text-white font-bold text-2xl">H</span>
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              Expert Home Services, <br />
              <span className="text-slate-400">On Demand.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Join thousands of homeowners and professionals connecting daily. Secure, fast, and reliable.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="flex flex-col">
          <div className="mb-6 flex p-1 bg-slate-100 rounded-xl self-start w-full">
            <button
              className={`flex-1 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "login"
                ? "bg-white text-black shadow-sm"
                : "text-slate-500 hover:text-slate-700"
                }`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "register"
                ? "bg-white text-black shadow-sm"
                : "text-slate-500 hover:text-slate-700"
                }`}
              onClick={() => setMode("register")}
            >
              Sign Up
            </button>
          </div>

          <div className="bg-white">
            {mode === "login" && <Login onForgotPassword={() => setMode("forgot-password")} />}
            {mode === "register" && <Register />}
            {mode === "forgot-password" && <ForgotPassword onBack={() => setMode("login")} />}
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
