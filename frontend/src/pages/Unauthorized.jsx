import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
   const navigate = useNavigate();

   const handleGoBack = () => {
      const storedUser =
         localStorage.getItem("vaultpay_user");

      if (storedUser) {
         try {
            const parsedUser =
               JSON.parse(storedUser);

            const userRole =
               parsedUser.role ||
               parsedUser.user?.role;

            if (userRole === "admin") {
               navigate("/admin/dashboard");
               return;
            }

            if (userRole === "client") {
               navigate("/client/dashboard");
               return;
            }
         } catch (error) {
            console.error(error);
         }
      }

      navigate("/");
   };

   return (
      <div className="unauthorized">
         <h1>403</h1>

         <p>Access Denied</p>

         <button
            className="pay-btn"
            style={{
               width: "250px",
               marginTop: "20px",
            }}
            onClick={handleGoBack}
         >
            Go Back
         </button>
      </div>
   );
};

export default Unauthorized;