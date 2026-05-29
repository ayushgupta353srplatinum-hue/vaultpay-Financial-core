const express = require("express");
const router = express.Router();

const {
   createInvoice,
   getInvoices,
   getSingleInvoice,
   downloadInvoice,
} = require("../controllers/invoiceController");

const {
   protect,
   adminOnly, // Aapke authMiddleware ke variable ke mutabik check rakhna
} = require("../middleware/authMiddleware");


// CREATE INVOICE (ADMIN ONLY)
// Path: POST https://vaultpay-financial-core.onrender.com/api/invoices/create
router.post(
   "/create",
   protect,
   adminOnly,
   createInvoice
);

// GET ALL INVOICES (Client/Admin verification loaded dynamically inside controller)
// Path: GET https://vaultpay-financial-core.onrender.com/api/invoices/
router.get(
   "/",
   protect,
   getInvoices
);

// GET SINGLE INVOICE (CRITICAL TRACK B REQUIREMENT: IDOR protection resides here)
// Path: GET https://vaultpay-financial-core.onrender.com/api/invoices/:id
router.get(
   "/:id",
   protect,
   getSingleInvoice
);

// DOWNLOAD AUTOMATED PDF RECEIPT
// Path: GET https://vaultpay-financial-core.onrender.com/api/invoices/download/:id
router.get(
   "/download/:id",
   protect,
   downloadInvoice
);

module.exports = router;