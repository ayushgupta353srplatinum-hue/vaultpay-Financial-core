import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true); 

   useEffect(() => {
   
      const localUserRaw = localStorage.getItem("user");
      if (localUserRaw) {
         try {
            const parsedUser = JSON.parse(localUserRaw);
            if (parsedUser && parsedUser.token) {
               setUser(parsedUser);
            } else {
               localStorage.removeItem("user"); 
            }
         } catch (e) {
            console.error("Context mapping decoding exception:", e);
            localStorage.removeItem("user");
         }
      }
      setLoading(false); 
   }, []);

   const login = (userData) => {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      if (userData.token) {
         localStorage.setItem("token", userData.token);
      }
   };

   const logout = () => {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
   };

   return (
      <AuthContext.Provider value={{ user, loading, login, logout }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);