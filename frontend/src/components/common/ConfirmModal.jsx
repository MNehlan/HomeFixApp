const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
    if (!isOpen) return null

    const confirmColors = {
        danger: "bg-red-600 hover:bg-red-700 shadow-red-600/20",
        primary: "bg-slate-900 hover:bg-black shadow-black/10",
        success: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
                <div className="p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">{message}</p>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-4 rounded-2xl text-sm hover:bg-slate-50 transition-all active:scale-95"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg active:scale-95 ${confirmColors[type]}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
