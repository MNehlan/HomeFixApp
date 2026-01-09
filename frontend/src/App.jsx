import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import TechnicianPending from "./pages/technician/TechnicianPending";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import PartnerSignup from "./pages/PartnerSignup";
import TechnicianPublicProfile from "./pages/TechnicianPublicProfile";
import ChatPage from "./pages/ChatPage";
import CustomerJobs from "./pages/customer/CustomerJobs"
import TechnicianJobs from "./pages/technician/TechnicianJobs"
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Home / Landing */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/partner" element={<PartnerSignup />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMER */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/jobs"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/profile/:technicianId"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <TechnicianPublicProfile />
            </ProtectedRoute>
          }
        />

        {/* TECHNICIAN */}
        <Route
          path="/technician"
          element={
            <ProtectedRoute
              allowedRoles={["technician"]}
              requireApprovedTechnician
            >
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/jobs"
          element={
            <ProtectedRoute
              allowedRoles={["technician"]}
              requireApprovedTechnician
            >
              <TechnicianJobs />
            </ProtectedRoute>
          }
        />

        {/* MESSAGING */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute allowedRoles={["customer", "technician"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute allowedRoles={["customer", "technician"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* TECHNICIAN PENDING */}
        <Route
          path="/technician/pending"
          element={
            <ProtectedRoute allowedRoles={["technician"]}>
              <TechnicianPending />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
