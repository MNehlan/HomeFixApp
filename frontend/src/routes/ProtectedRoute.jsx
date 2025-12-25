import { Navigate } from "react-router-dom"
import { useAuth } from "../context/auth-context"

const ProtectedRoute = ({
  children,
  allowedRoles,
  requireApprovedTechnician = false,
}) => {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/auth" replace />

  const hasAllowedRole =
    !allowedRoles ||
    allowedRoles.includes(user.role) ||
    allowedRoles.some((role) => user.roles?.includes(role))

  if (!hasAllowedRole) {
    return <Navigate to="/not-found" replace />
  }

  if (
    requireApprovedTechnician &&
    user.technicianStatus !== "APPROVED"
  ) {
    return <Navigate to="/technician/pending" replace />
  }

  return children
}

export default ProtectedRoute
