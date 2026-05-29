const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Invoice = require("../models/Invoice"); // Make sure schema references are declared accurately

const protect = async (req, res, next) => {
   let token;

   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
         token = req.headers.authorization.split(" ")[1];

         const decoded = jwt.verify(token, process.env.JWT_SECRET);

         req.user = await User.findById(decoded.id).select("-password");
         next();
      } catch (error) {
         return res.status(401).json({ message: "Not authorized, token signature validation failure." });
      }
   }

   if (!token) {
      return res.status(401).json({ message: "No token provided, session access aborted." });
   }
};

const adminOnly = (req, res, next) => {
   if (req.user && req.user.role === "admin") {
      next();
   } else {
      return res.status(403).json({ message: "Admin access only. Resource restricted." });
   }
};

const verifyInvoiceOwnership = async (req, res, next) => {
   try {
      const { id } = req.params; // Read targeted dynamic document asset index
      const userId = req.user._id || req.user.id;
      const userRole = req.user.role;

      if (userRole === "admin") return next();

      const invoice = await Invoice.findById(id);
      if (!invoice) {
         return res.status(404).json({ message: "Requested ledger record could not be localized within server modules." });
      }

      if (invoice.client.toString() !== userId.toString()) {
         console.error(`🚨 [SECURITY AUDIT ATTACK ALERT]: Account identity ${userId} intercepted executing IDOR targeting resource object id: ${id}`);
         return res.status(403).json({ message: "FORBIDDEN PROTOCOL: Direct Object reference ownership breach detected." });
      }

      next();
   } catch (error) {
      console.error("IDOR tracking interception failure:", error);
      return res.status(500).json({ message: "Security gateway execution exception." });
   }
};

module.exports = {
   protect,
   adminOnly,
   verifyInvoiceOwnership
};