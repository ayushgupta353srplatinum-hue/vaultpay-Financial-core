import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
   const navigate = useNavigate();

   useEffect(() => {
      const timer = setTimeout(() => {
         navigate("/client/dashboard");
      }, 3500);

      return () => clearTimeout(timer);
   }, [navigate]);

   return (
      <div className="auth-container">
         <div className="auth-box">
            <h1>Payment Successful</h1>

            <p>
               Redirecting to dashboard...
            </p>
         </div>
      </div>
   );
};

export default PaymentSuccess;