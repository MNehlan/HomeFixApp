const VerifyTechnicianCard = ({ technician, onApprove, onReject }) => {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-lg">{technician.name}</h3>
        <p>Email: {technician.email}</p>
        <p>Category: {technician.category}</p>
        <p>Experience: {technician.experience}</p>
        <p>Price: ₹{technician.price}</p>
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
