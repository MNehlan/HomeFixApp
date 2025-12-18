/**
 * Allow only admin user
 */
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Admin only",
    })
  }
  next()
}

/**
 * Allow only approved technicians
 */
export const isApprovedTechnician = (req, res, next) => {
  if (
    !req.user ||
    !req.user.roles?.includes("technician") ||
    req.user.technicianStatus !== "APPROVED"
  ) {
    return res.status(403).json({
      message: "Access denied: Technician not approved",
    })
  }
  next()
}

/**
 * Allow only customers
 */
export const isCustomer = (req, res, next) => {
  if (!req.user || !req.user.roles?.includes("customer")) {
    return res.status(403).json({
      message: "Access denied: Customer only",
    })
  }
  next()
}
