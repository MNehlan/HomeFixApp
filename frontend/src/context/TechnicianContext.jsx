import { createContext, useContext, useState } from "react"

const TechnicianContext = createContext()

export const TechnicianProvider = ({ children }) => {
  const [technician, setTechnician] = useState(null)

  return (
    <TechnicianContext.Provider value={{ technician, setTechnician }}>
      {children}
    </TechnicianContext.Provider>
  )
}

export const useTechnician = () => useContext(TechnicianContext)
