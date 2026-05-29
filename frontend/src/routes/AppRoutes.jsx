import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AdminDashboard from "../pages/AdminDashboard";
import ClientDashboard from "../pages/ClientDashboard";
import InvoiceDetail from "../pages/InvoiceDetail";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
   return (
      <Routes>
         {/* Public Routes */}
         <Route path="/" element={<LoginPage />} />
         <Route path="/register" element={<RegisterPage />} />
         <Route path="/unauthorized" element={<Unauthorized />} />

         {/* Admin Only Routes */}
         <Route 
            path="/admin/dashboard" 
            element={
               <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
               </ProtectedRoute>
            } 
         />

         {/* Client Only Routes */}
         <Route 
            path="/client/dashboard" 
            element={
               <ProtectedRoute allowedRole="client">
                  <ClientDashboard />
               </ProtectedRoute>
            } 
         />

         <Route 
            path="/invoice/:id" 
            element={
               <ProtectedRoute allowedRole="client">
                  <InvoiceDetail />
               </ProtectedRoute>
            } 
         />

         {/* Fallback Missing Routes */}
         <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
   );
};

export default AppRoutes;