import { useState } from "react"
import { useAuth } from "../../context/AuthContextDefinition"

const ForgotPassword = ({ onBack }) => {
    const { resetPassword } = useAuth()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) return

        setLoading(true)
        setMessage(null)
        setError(null)

        try {
            await resetPassword(email)
            setMessage("Check your inbox for further instructions")
        } catch (err) {
            setError("Failed to reset password. " + (err.message || ""))
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="space-y-1.5">
                <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
                <p className="text-sm text-slate-500">
                    Enter your email to receive password reset instructions.
                </p>
            </div>

            {error && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
                    {error}
                </p>
            )}

            {message && (
                <p className="text-green-500 text-sm bg-green-50 border border-green-200 rounded px-3 py-2">
                    {message}
                </p>
            )}

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border-slate-200 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <button
                disabled={loading}
                className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-bold tracking-wide hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-black/20"
            >
                {loading ? "Sending..." : "Reset Password"}
            </button>

            <div className="text-center">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-sm font-semibold text-slate-500 hover:text-black transition-colors"
                >
                    Back to Login
                </button>
            </div>
        </form>
    )
}

export default ForgotPassword
