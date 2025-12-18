import { useState } from "react"
import { applyTechnician } from "../../services/technicianService"
import { useNavigate } from "react-router-dom"

const TechnicianApplyForm = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    category: "",
    experience: "",
    price: "",
  })

  const submit = async (e) => {
    e.preventDefault()
    await applyTechnician(form)
    navigate("/technician/pending")
  }

  return (
    <form onSubmit={submit} className="border p-4 rounded mt-6">
      <h2 className="font-bold mb-2">Become a Technician</h2>

      <input
        placeholder="Category"
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      />

      <input
        placeholder="Experience"
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setForm({ ...form, experience: e.target.value })
        }
      />

      <input
        placeholder="Price"
        type="number"
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Apply
      </button>
    </form>
  )
}

export default TechnicianApplyForm
