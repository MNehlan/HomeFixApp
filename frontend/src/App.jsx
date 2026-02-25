import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardOverview from "./pages/admin/DashboardOverview";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminJobsPage from "./pages/admin/AdminJobsPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import CustomerJobs from "./pages/customer/CustomerJobs";
import TechnicianJobs from "./pages/technician/TechnicianJobs";

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            padding: '16px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid #f1f5f9',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
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
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
        </Route>

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
