import { useState } from 'react'
import { X, Calendar, Clock, AlertCircle } from 'lucide-react'

const ServiceRequestModal = ({ technicianId, technicianName, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        description: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5001/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token} `
                },
                body: JSON.stringify({
                    technicianId,
                    ...formData
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to request service')
            }

            onSuccess()
            onClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-800">

                {/* Header */}
                <div className="relative h-24 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
                    >
                        <X size={20} />
                    </button>
                    <div className="text-center text-white">
                        <h2 className="text-xl font-bold">Request Service</h2>
                        <p className="text-sm text-blue-100 opacity-90">with {technicianName}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm flex items-start gap-2">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Problem Description</label>
                            <textarea
                                name="description"
                                required
                                rows="3"
                                placeholder="Describe the issue in detail..."
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none dark:text-white"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Sending Request...' : 'Send Request'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ServiceRequestModal
