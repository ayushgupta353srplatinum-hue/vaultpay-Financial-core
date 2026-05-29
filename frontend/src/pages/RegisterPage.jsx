import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] =
      useState("");

   const [loading, setLoading] =
      useState(false);

   const [error, setError] = useState("");

   const navigate = useNavigate();

   const handleRegister = async (e) => {
      e.preventDefault();

      try {
         setLoading(true);
         setError("");

         await axios.post(
            "https://vaultpay-financial-core.onrender.com/api/auth/register",
            {
               name,
               email,
               password,
               role: "client",
            }
         );

         navigate("/");
      } catch (err) {
         console.error(err);
         setError("Registration failed");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="auth-container">
         <div className="auth-box">
            <h1>VaultPay</h1>

            <p>Create account</p>

            {error && (
               <p
                  style={{
                     color: "#ef4444",
                  }}
               >
                  {error}
               </p>
            )}

            <form onSubmit={handleRegister}>
               <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) =>
                     setName(e.target.value)
                  }
                  required
               />

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
                     ? "Creating..."
                     : "Register"}
               </button>
            </form>

            <div className="auth-link">
               <Link to="/">
                  Already have account?
               </Link>
            </div>
         </div>
      </div>
   );
};

export default RegisterPage;