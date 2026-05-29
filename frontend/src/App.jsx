import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Unauthorized from "./pages/Unauthorized";
import InvoiceDetail from "./pages/InvoiceDetail";
import PaymentSuccess from "./pages/PaymentSuccess"; // Imported properly
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
   return (
      <AuthProvider>
         <BrowserRouter>
            <Routes>
               {/* Public Routes */}
               <Route path="/" element={<LoginPage />} />
               <Route path="/register" element={<RegisterPage />} />
               <Route path="/unauthorized" element={<Unauthorized />} />

               {/* Protected Admin Routes */}
               <Route
                  path="/admin/dashboard"
                  element={
                     <ProtectedRoute allowedRole="admin">
                        <AdminDashboard />
                     </ProtectedRoute>
                  }
               />

               {/* Protected Client Routes */}
               <Route
                  path="/client/dashboard"
                  element={
                     <ProtectedRoute allowedRole="client">
                        <ClientDashboard />
                     </ProtectedRoute>
                  }
               />

               {/* FIX: ADDED STRIPE PAYMENT SUCCESS ROUTE (Client Authenticated) */}
               <Route
                  path="/payment-success"
                  element={
                     <ProtectedRoute allowedRole="client">
                        <PaymentSuccess />
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
            </Routes>
         </BrowserRouter>
      </AuthProvider>
   );
}

export default App;