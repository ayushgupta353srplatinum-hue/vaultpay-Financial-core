import axios from "axios";

const API =
   "https://vaultpay-financial-core.onrender.com/api/auth";

const login = async (
   userData
) => {

   const response =
      await axios.post(
         `${API}/login`,
         userData
      );

   return response.data;
};

const register = async (
   userData
) => {

   const response =
      await axios.post(
         `${API}/register`,
         userData
      );

   return response.data;
};

const authService = {
   login,
   register,
};

export default authService;