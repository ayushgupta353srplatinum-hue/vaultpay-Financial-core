import { useNavigate }
from "react-router-dom";

import { useAuth }
from "../context/AuthContext";

const Navbar = () => {

   const navigate = 
      useNavigate();

   const { user, logout } =
      useAuth();

   const handleLogout =
      () => {

         logout();

         navigate("/");
      };

   return (

      <nav className="navbar">

         <div className="nav-left">

            <h2>
               VaultPay
            </h2>

         </div>

         <div className="nav-right">

            <span>
               {
                  user?.role
               }
            </span>

            <button
               onClick={
                  handleLogout
               }
            >

               Logout

            </button>

         </div>

      </nav>
   );
};

export default Navbar;