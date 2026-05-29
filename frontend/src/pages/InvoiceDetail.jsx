import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import invoiceService from "../services/invoiceService";

const InvoiceDetail = () => {
   const { id } = useParams();

   const navigate = useNavigate();

   const { user } = useAuth();

   const [invoice, setInvoice] =
      useState(null);

   const [loading, setLoading] =
      useState(true);

   const [error, setError] = useState("");

   useEffect(() => {
      const fetchInvoiceDetails = async () => {
         try {
            const data =
               await invoiceService.getSingleInvoice(
                  id,
                  user.token
               );

            setInvoice(data);
         } catch (err) {
            console.error(err);

            setError("Unauthorized");

            if (
               err.response?.status === 403
            ) {
               navigate("/unauthorized");
            }
         } finally {
            setLoading(false);
         }
      };

      fetchInvoiceDetails();
   }, [id, user.token, navigate]);

   const handleDownload = () => {
      const downloadUrl = `https://vaultpay-financial-core.onrender.com/api/invoices/download/${id}?token=${user.token}`;

      window.open(downloadUrl, "_blank");
   };

   return (
      <div className="dashboard">
         <Navbar />

         <div className="invoice-card">
            <h1>Invoice Details</h1>

            {loading && <p>Loading...</p>}

            {error && (
               <p
                  style={{
                     color: "#ef4444",
                  }}
               >
                  {error}
               </p>
            )}

            {invoice && (
               <>
                  <p>
                     Amount: ₹
                     {invoice.amount}
                  </p>

                  <p>
                     Description:{" "}
                     {invoice.description}
                  </p>

                  <p>
                     Status:{" "}
                     {invoice.status}
                  </p>

                  <button
                     className="pay-btn"
                     onClick={
                        handleDownload
                     }
                  >
                     Download PDF
                  </button>
               </>
            )}
         </div>
      </div>
   );
};

export default InvoiceDetail;