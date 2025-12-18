import { useState } from "react"
import { updateUserProfile } from "../../services/userService"

const ProfileEdit = () => {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  const submit = async (e) => {
    e.preventDefault()
    await updateUserProfile({ name })
    setMessage("Profile updated")
  }

  return (
    <form onSubmit={submit} className="p-4 border rounded mt-4">
      <input
        className="border p-2 w-full mb-2"
        placeholder="New name"
        onChange={(e) => setName(e.target.value)}
      />
      <button className="bg-black text-white px-4 py-2 rounded">
        Save
      </button>
      {message && <p className="text-green-600 mt-2">{message}</p>}
    </form>
  )
}

export default ProfileEdit
