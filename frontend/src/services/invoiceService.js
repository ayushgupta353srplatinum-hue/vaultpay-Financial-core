import axios from "axios";

const API =
   "http://localhost:5000/api/invoices";

const getInvoices =
   async (token) => {

      const config = {
         headers: {
            Authorization:
               `Bearer ${token}`,
         },
      };

      const response =
         await axios.get(
            API,
            config
         );

      return response.data;
   };

const payInvoice =
   async (invoiceId, token) => {

      const config = {
         headers: {
            Authorization:
               `Bearer ${token}`,
         },
      };

      const response =
         await axios.post(
            `${API}/pay/${invoiceId}`,
            {},
            config
         );

      return response.data;
   };

const getSingleInvoice =
   async (id, token) => {

      const config = {
         headers: {
            Authorization:
               `Bearer ${token}`,
         },
      };

      const response =
         await axios.get(
            `${API}/${id}`,
            config
         );

      return response.data;
   };

const downloadInvoice =
   async (id, token) => {

      window.open(
         `${API}/download/${id}?token=${token}`
      );
   };

export default {
   getInvoices,
   payInvoice,
   getSingleInvoice,
   downloadInvoice,
};