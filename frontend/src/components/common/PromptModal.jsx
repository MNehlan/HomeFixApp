import { useState } from "react"

const PromptModal = ({ isOpen, title, message, placeholder, defaultValue = "", onSubmit, onCancel }) => {
    const [value, setValue] = useState(defaultValue)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
                <div className="p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm font-medium mb-6">{message}</p>

                    <input
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all mb-8"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onSubmit(value)
                            if (e.key === 'Escape') onCancel()
                        }}
                    />

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-4 rounded-2xl text-sm hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSubmit(value)}
                            className="flex-[2] bg-slate-900 text-white font-bold py-4 rounded-2xl text-sm hover:bg-black transition-all shadow-lg shadow-black/10 active:scale-95"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PromptModal
