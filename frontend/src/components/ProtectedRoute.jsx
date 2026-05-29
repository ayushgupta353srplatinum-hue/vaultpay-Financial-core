import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
   const { user, loading } = useAuth();

   if (loading) {
      return (
         <div style={{ background: '#0b0f19', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#2563eb', fontFamily: 'sans-serif', fontSize: '18px', fontWeight: 'bold' }}>
            Synchronizing Secure Session Data Nodes...
         </div>
      );
   }

   const localUserRaw = localStorage.getItem("user");
   const activeUser = user || (localUserRaw ? JSON.parse(localUserRaw) : null);

   if (!activeUser || !activeUser.token) {
      console.warn(" Unauthorized intercept: Identity verification failed. Router blocked.");
      return <Navigate to="/" replace />;
   }

   const userRole = activeUser.role || activeUser.user?.role;

   if (userRole !== allowedRole) {
      console.error(` Role security violation intercepted. Redirecting token.`);
      return <Navigate to="/unauthorized" replace />;
   }

   return children;
};

export default ProtectedRoute;