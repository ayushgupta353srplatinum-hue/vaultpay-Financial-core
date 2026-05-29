import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const { login } = useAuth();
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         setLoading(true);
         setError("");

         const res = await axios.post(
            "http://localhost:5000/api/auth/login",
            {
               email,
               password,
            }
         );

         if (res.data?.token) {
            login(res.data);

            const userRole =
               res.data.role ||
               res.data.user?.role;

            if (userRole === "admin") {
               navigate("/admin/dashboard");
            } else {
               navigate("/client/dashboard");
            }
         }
      } catch (err) {
         console.error(err);
         setError("Invalid credentials");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="auth-container">
         <div className="auth-box">
            <h1>VaultPay</h1>

            <p>Login to continue</p>

            {error && (
               <p
                  style={{
                     color: "#ef4444",
                  }}
               >
                  {error}
               </p>
            )}

            <form onSubmit={handleSubmit}>
               <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                     setEmail(e.target.value)
                  }
                  required
               />

               <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                     setPassword(
                        e.target.value
                     )
                  }
                  required
               />

               <button
                  type="submit"
                  disabled={loading}
               >
                  {loading
                     ? "Loading..."
                     : "Login"}
               </button>
            </form>

            <div className="auth-link">
               <Link to="/register">
                  Create Account
               </Link>
            </div>
         </div>
      </div>
   );
};

export default LoginPage;