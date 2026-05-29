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
// Path: POST http://localhost:5000/api/invoices/create
router.post(
   "/create",
   protect,
   adminOnly,
   createInvoice
);

// GET ALL INVOICES (Client/Admin verification loaded dynamically inside controller)
// Path: GET http://localhost:5000/api/invoices/
router.get(
   "/",
   protect,
   getInvoices
);

// GET SINGLE INVOICE (CRITICAL TRACK B REQUIREMENT: IDOR protection resides here)
// Path: GET http://localhost:5000/api/invoices/:id
router.get(
   "/:id",
   protect,
   getSingleInvoice
);

// DOWNLOAD AUTOMATED PDF RECEIPT
// Path: GET http://localhost:5000/api/invoices/download/:id
router.get(
   "/download/:id",
   protect,
   downloadInvoice
);

module.exports = router;