const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// LOAD ENV VARIABLES FIRST
dotenv.config();

// DATABASE CONNECTION
const connectDB = require("./config/db");

// ROUTE IMPORTS
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const adminRoutes = require("./routes/adminRoutes"); // Iske andar hamara clients endpoint kaam karega
const clientRoutes = require("./routes/clientRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

// CONNECT DATABASE
connectDB();

const app = express();

// MIDDLEWARE SETUP
app.use(cors());

// REQUIREMENT 2: Stripe Webhook Route Must be Before express.json()
// Kyunki Stripe ko signature verification ke liye raw body chahiye hoti hai
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());

// ROUTE HANDLERS
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminRoutes); // Handles: /api/admin/clients
app.use("/api/client", clientRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);

// GLOBAL HOME ROUTE
app.get("/", (req, res) => {
   res.send("VaultPay API Running");
});

// SERVER LEASE
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});