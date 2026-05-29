import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
   const { user } = useAuth();

   const [invoices, setInvoices] = useState([]);
   const [clients, setClients] = useState([]);
   const [loading, setLoading] = useState(true);

   const [selectedClientId, setSelectedClientId] =
      useState("");
   const [amount, setAmount] = useState("");
   const [description, setDescription] = useState("");

   const [formLoading, setFormLoading] =
      useState(false);

   const fetchData = async () => {
      try {
         setLoading(true);

         const token = user?.token;

         const invoiceRes = await axios.get(
            "https://vaultpay-financial-core.onrender.com/api/invoices",
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         setInvoices(invoiceRes.data || []);

         const clientRes = await axios.get(
            "https://vaultpay-financial-core.onrender.com/api/admin/clients",
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         setClients(clientRes.data || []);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (user) {
         fetchData();
      }
   }, [user]);

   const totalRevenue = invoices.reduce(
      (acc, curr) =>
         curr.status === "Paid"
            ? acc + Number(curr.amount)
            : acc,
      0
   );

   const handleCreateInvoice = async (e) => {
      e.preventDefault();

      try {
         setFormLoading(true);

         const token = user?.token;

         await axios.post(
            "https://vaultpay-financial-core.onrender.com/api/invoices/create",
            {
               client: selectedClientId,
               amount: Number(amount),
               description,
            },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         setSelectedClientId("");
         setAmount("");
         setDescription("");

         fetchData();
      } catch (err) {
         console.error(err);
      } finally {
         setFormLoading(false);
      }
   };

   return (
      <div className="dashboard">
         <Navbar />

         <div className="page-header">
            <h1>Admin Dashboard</h1>
            <p>Manage invoices and clients</p>
         </div>

         <div
            className="invoice-card"
            style={{
               marginBottom: "30px",
               maxWidth: "400px",
            }}
         >
            <div className="invoice-top">
               <h3>₹{totalRevenue}</h3>
            </div>

            <p className="desc">
               Total Revenue
            </p>

            <p>Total Invoices: {invoices.length}</p>
         </div>

         <div
            className="invoice-card"
            style={{
               marginBottom: "40px",
            }}
         >
            <h2
               style={{
                  marginBottom: "20px",
               }}
            >
               Create Invoice
            </h2>

            <form
               onSubmit={handleCreateInvoice}
               style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
               }}
            >
               <select
                  value={selectedClientId}
                  onChange={(e) =>
                     setSelectedClientId(
                        e.target.value
                     )
                  }
                  required
                  className="auth-input"
               >
                  <option value="">
                     Select Client
                  </option>

                  {clients.map((c) => (
                     <option
                        key={c._id}
                        value={c._id}
                     >
                        {c.name} ({c.email})
                     </option>
                  ))}
               </select>

               <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) =>
                     setAmount(e.target.value)
                  }
                  required
               />

               <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) =>
                     setDescription(
                        e.target.value
                     )
                  }
                  required
               />

               <button
                  type="submit"
                  className="pay-btn"
                  disabled={formLoading}
               >
                  {formLoading
                     ? "Creating..."
                     : "Create Invoice"}
               </button>
            </form>
         </div>

         {loading ? (
            <p>Loading...</p>
         ) : (
            <div className="invoice-grid">
               {invoices.map((invoice) => (
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

                     <p>
                        Client:{" "}
                        {invoice.client?.name}
                     </p>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default AdminDashboard;