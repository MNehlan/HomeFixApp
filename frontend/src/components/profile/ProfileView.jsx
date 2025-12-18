import { useEffect, useState } from "react"
import { getUserProfile } from "../../services/userService"

const ProfileView = () => {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const load = async () => {
      const data = await getUserProfile()
      setProfile(data)
    }
    load()
  }, [])

  if (!profile) return <p>Loading...</p>

  return (
    <div className="p-4 border rounded">
      <p><b>Name:</b> {profile.name}</p>
      <p><b>Email:</b> {profile.email}</p>
      <p><b>Role:</b> {profile.role}</p>
    </div>
  )
}

export default ProfileView
