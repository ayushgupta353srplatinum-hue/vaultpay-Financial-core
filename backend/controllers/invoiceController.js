const Invoice = require("../models/Invoice");
const PDFDocument = require("pdfkit"); // Dynamically generates receipt layout streams

const createInvoice = async (req, res) => {
   try {
      const { client, amount, description } = req.body;

      const invoice = await Invoice.create({
         client,
         amount,
         description,
      });

      res.status(201).json(invoice);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};


const getInvoices = async (req, res) => {
   try {
      let invoices;

      // ADMIN: Fetch system master entries
      if (req.user.role === "admin") {
         invoices = await Invoice.find().populate("client", "name email");
      } else {
         // CLIENT: Fetch only ownership linked scopes
         invoices = await Invoice.find({ client: req.user._id });
      }

      res.json(invoices);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

const getSingleInvoice = async (req, res) => {
   try {
      const invoice = await Invoice.findById(req.params.id).populate("client", "name email");

      if (!invoice) {
         return res.status(404).json({ message: "Invoice record not located" });
      }

      // IDOR SECURITY BLOCK
      if (
         req.user.role !== "admin" &&
         invoice.client._id.toString() !== req.user._id.toString()
      ) {
         return res.status(403).json({ message: "Forbidden Access Matrix Violations" });
      }

      res.json(invoice);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

const downloadInvoice = async (req, res) => {
   try {
    
      const invoice = await Invoice.findById(req.params.id);

      if (!invoice) {
         return res.status(404).json({ message: "Invoice entry not present within logs" });
      }

      if (req.user.role === "client") {
         if (invoice.client.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access Denied: Crypto Signatures Mismatch" });
         }
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=receipt-${invoice._id}.pdf`);

      const doc = new PDFDocument({ margin: 50 });
      doc.pipe(res); 

   
      doc.rect(0, 0, doc.page.width, 20).fill("#0b0f19");

      doc.fillColor("#2563eb").fontSize(28).text("VAULTPAY LEDGER", 50, 60, { bold: true });
      doc.fillColor("#64748b").fontSize(10).text("ZERO-TRUST DIGITAL FINANCIAL SYSTEM", 50, 95);
      doc.moveDown();


      doc.moveTo(50, 115).lineTo(550, 115).strokeColor("#cbd5e1").lineWidth(1).stroke();

      doc.fillColor("#1e293b").fontSize(14).text(`Receipt Token Ref: ${invoice._id}`, 50, 140);
      doc.fontSize(12).text(`Status Matrix: ${invoice.status.toUpperCase()}`, 50, 165);
      doc.text(`Timestamp Scope: ${new Date(invoice.createdAt).toLocaleDateString()}`, 50, 190);

      doc.rect(50, 230, 500, 100).fill("#f8fafc");
      doc.fillColor("#0f172a").fontSize(12).text("Transaction Description Details:", 65, 245, { underline: true });
      doc.fillColor("#334155").text(invoice.description, 65, 275, { width: 470 });

      doc.rect(50, 360, 500, 50).fill("#ecfdf5");
      doc.fillColor("#065f46").fontSize(16).text("TOTAL AMOUNT VERIFIED (INR):", 70, 378, { bold: true });
      doc.fillColor("#047857").fontSize(18).text(`Rs. ${invoice.amount}.00`, 380, 376, { bold: true });

      doc.moveTo(50, 680).lineTo(550, 680).strokeColor("#e2e8f0").stroke();
      doc.fillColor("#94a3b8").fontSize(9).text("This document represents mathematically immutable billing data transferred under valid session token permissions.", 50, 700, { align: "center" });

      doc.end();

   } catch (error) {
      console.error("Critical Receipt Generation Failure:", error);
      // Fallback check logic to prevent crash errors if streaming breaks midway
      if (!res.headersSent) {
         res.status(500).json({ message: "Internal generation failure within microservice runtime context" });
      }
   }
};

module.exports = {
   createInvoice,
   getInvoices,
   getSingleInvoice,
   downloadInvoice,
};