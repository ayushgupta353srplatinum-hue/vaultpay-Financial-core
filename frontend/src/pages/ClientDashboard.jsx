import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Navbar from "../components/Navbar";

const ClientDashboard = () => {
   const { user } = useAuth();

   const [invoices, setInvoices] = useState([]);
   const [loading, setLoading] = useState(true);
   const [paymentLoadingId, setPaymentLoadingId] = useState(null);
   const [downloadLoadingId, setDownloadLoadingId] = useState(null);
   const [error, setError] = useState("");

   const fetchClientInvoices = async () => {
      try {
         setLoading(true);

         const token =
            user?.token ||
            JSON.parse(localStorage.getItem("user"))?.token;

         const res = await axios.get(
            "https://vaultpay-financial-core.onrender.com/api/invoices",
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         setInvoices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
         console.error(err);
         setError("Could not retrieve invoices.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      const activeUser =
         user || JSON.parse(localStorage.getItem("user"));

      if (activeUser) {
         fetchClientInvoices();
      }
   }, [user]);

   const handlePayment = async (invoiceId) => {
      if (paymentLoadingId) return;

      try {
         setPaymentLoadingId(invoiceId);
         setError("");

         const token =
            user?.token ||
            JSON.parse(localStorage.getItem("user"))?.token;

         const response = await axios.post(
            `https://vaultpay-financial-core.onrender.com/api/payments/checkout/${invoiceId}`,
            {},
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         if (response.data?.url) {
            window.location.href = response.data.url;
         }
      } catch (err) {
         console.error(err);
         setError("Payment failed.");
         setPaymentLoadingId(null);
      }
   };

   const handleDownloadReceipt = async (invoiceId) => {
      try {
         setDownloadLoadingId(invoiceId);

         const token =
            user?.token ||
            JSON.parse(localStorage.getItem("user"))?.token;

         const response = await axios.get(
            `https://vaultpay-financial-core.onrender.com/api/invoices/download/${invoiceId}`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
               responseType: "blob",
            }
         );

         const blob = new Blob([response.data], {
            type: "application/pdf",
         });

         const url = window.URL.createObjectURL(blob);

         const link = document.createElement("a");
         link.href = url;
         link.setAttribute(
            "download",
            `receipt-${invoiceId}.pdf`
         );

         document.body.appendChild(link);
         link.click();

         document.body.removeChild(link);
         window.URL.revokeObjectURL(url);
      } catch (err) {
         console.error(err);
         setError("Receipt download failed.");
      } finally {
         setDownloadLoadingId(null);
      }
   };

   return (
      <div className="dashboard">
         <Navbar />

         <div className="page-header">
            <h1>Billing Dashboard</h1>
            <p>Manage your invoices</p>
         </div>

         {error && (
            <p
               style={{
                  color: "#ef4444",
                  marginBottom: "20px",
               }}
            >
               {error}
            </p>
         )}

         {loading ? (
            <p>Loading invoices...</p>
         ) : (
            <div className="invoice-grid">
               {invoices.length === 0 ? (
                  <p>No invoices found.</p>
               ) : (
                  invoices.map((invoice) => (
                     <div
                        key={invoice._id}
                        className="invoice-card"
                     >
                        <div className="invoice-top">
                           <h3>₹{invoice.amount}</h3>

                           <span
                              className={
                                 invoice.status === "Paid"
                                    ? "paid"
                                    : "pending"
                              }
                           >
                              {invoice.status}
                           </span>
                        </div>

                        <p className="desc">
                           {invoice.description}
                        </p>

                        {invoice.status !== "Paid" ? (
                           <button
                              className="pay-btn"
                              onClick={() =>
                                 handlePayment(invoice._id)
                              }
                              disabled={
                                 paymentLoadingId ===
                                 invoice._id
                              }
                           >
                              {paymentLoadingId ===
                              invoice._id
                                 ? "Processing..."
                                 : "Pay Now"}
                           </button>
                        ) : (
                           <button
                              className="pay-btn"
                              onClick={() =>
                                 handleDownloadReceipt(
                                    invoice._id
                                 )
                              }
                              disabled={
                                 downloadLoadingId ===
                                 invoice._id
                              }
                           >
                              {downloadLoadingId ===
                              invoice._id
                                 ? "Downloading..."
                                 : "Download Receipt"}
                           </button>
                        )}
                     </div>
                  ))
               )}
            </div>
         )}
      </div>
   );
};

export default ClientDashboard;