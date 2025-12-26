const VerifyTechnicianCard = ({ technician, onApprove, onReject }) => {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-start">
      <div>
        <div className="flex items-center gap-4 mb-3">
          {technician.profilePic && (
            <img
              src={technician.profilePic}
              alt={technician.name}
              className="w-16 h-16 rounded-full object-cover border"
            />
          )}
          <div>
            <h3 className="font-semibold text-lg">{technician.name}</h3>
            <p className="text-sm text-slate-500">{technician.email}</p>
          </div>
        </div>

        <div className="space-y-1 text-sm text-slate-700">
          <p><span className="font-semibold">Category:</span> {technician.category}</p>
          <p><span className="font-semibold">Experience:</span> {technician.experience}</p>
          <p><span className="font-semibold">Price:</span> ₹{technician.price}</p>
          {technician.certificateUrl && (
            <p className="mt-2">
              <span className="font-semibold">Certificate: </span>
              <a
                href={technician.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Document
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onApprove(technician.uid)}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Approve
        </button>

        <button
          onClick={() => onReject(technician.uid)}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Reject
        </button>
      </div>
    </div>
  )
}

export default VerifyTechnicianCard
